(function () { 'use strict'; }());
import { Activity } from '../model';
import { setTimeout } from 'timers';
import config from '../config';
import { logger } from '../../logger';

const sortOption ={ '_id': 'desc' };
const alreadyAnswerMessage = {
    type: 'text',
    text: 'you already have answered the question'
};

//handle when messages were sent
async function handleInMessage(message, userId, schema, userprofile) {
    var matchedActivities = await this.dal.find({ userId: userId }, schema, sortOption, 1)
    // Find for checking if user sending message is one we waiting for response(ask state = true)
    if (matchedActivities != undefined) {
        let matchedActivity = matchedActivities[0];
        if (matchedActivity.plan === 'none') {
            //if plan parameter equals to none then updated an answer with incomeing message 
            this.dal.update(schema, { userId: userId }, { plan: message.text }, sortOption)
            matchedActivity.plan = message.text;
            this.elastic.save(matchedActivity);
            await this.messageService.sendWalkInMessage(matchedActivity, userprofile);
        }
        else {
            await this.messageService.sendMessage(userId, alreadyAnswerMessage);
        }
    } else {
        //will go into this when user send message to bot out of context
        return;
    }
}

async function askTodayPlan(userId, location, schema, userprofile) { //send the question to users
    this.messageService.sendMessage(userId, 'what\'s your plan to do today at ' + location + ' ?');
    const { err, result } = await this.dal.update(schema, { userId: userId }, { askstate: true }, sortOption)// update to mark as already ask question
    if (err) {
        logger.error('update unsuccessful', err)
        return 'update unsuccessful ', err;
    }
    else {
        logger.info('update successful');
        const call_callback = await this.callback(userId, location, 0, schema, userprofile)
        if (err) {
            return err
        }
        return call_callback;
    }

}


async function callback(userId, location, count, schema, userprofile) {  //handle when users do not answer question within 15 seconds

    return new Promise((resolve, reject) => {
        setTimeout(async () => {

            logger.debug(`call back for ${count} times`);
            var checkAns = await this.dal.find({ userId: userId }, schema, sortOption, 1)

            if (checkAns[0].plan === 'none' && count < 3) {
                //this.messageService.sendMessage(userId, 'Please enter your answer');
                count = count + 1;
                let result = await this.callback(userId, location, count, schema, userprofile);
                resolve(result);

            } else if (checkAns[0].plan === 'none' && count == 3) {
                // has notified for 3 times but no response
                await this.dal.update(schema, { userId: userId }, { plan: '           ' }, sortOption)
                     await this.messageService.sendWalkInMessage(checkAns[0], userprofile)
                    .then(() => {
                        resolve("update answer and exist loop from conver,callback");
                    }
                    ).catch(err => {
                        resolve(err)
                    });
            }
            else if (checkAns[0].plan != 'none') {
                resolve("exist loop from conver,callback");
            }
        }, this.answerAlertDuration);
    });
}

class ConversationService {
    constructor(dal, messageService, elasticService, answerAlertDuration) {
        this.askTodayPlan = askTodayPlan;
        this.callback = callback;
        this.handleInMessage = handleInMessage;
        this.messageService = messageService;
        this.elastic = elasticService;
        this.dal = dal;
        this.answerAlertDuration = answerAlertDuration;
    }
}
export {
    ConversationService
};
