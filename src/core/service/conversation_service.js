(function () { 'use strict'; }());
import { setTimeout } from 'timers';
import { logger } from '../../logger';
const moment = require('moment')
const today = moment().startOf('day')

const sortOption = { new: true, sort: { _id: -1 } };
const alreadyAnswerMessage = {
    type: 'text',
    text: 'you already have answered the question'
};

//handle when received messages
async function handleInMessage(message, userId, timestamp, schema, userprofile) {

    var matchedActivities = await this.dal.find({ // find match activities
        userId: userId,
        timestamp: {
            $gte: today.toDate(),
            $lte: moment(today).endOf('day').toDate()
        }
    }, schema, { _id: -1 })

    let matchedActivity = matchedActivities[0];
    console.log("-------------",matchedActivity)
    //consider the user will clock out or not 
    if (message.text === "Yes") { //user wants to clock out 
        if (matchedActivity.type === "out") { // it means user has already clocked out
            this.messageService.sendMessage(userId, "already clock out");
        } else {

            const saveobj = new schema({
                userId: matchedActivity.userId,
                displayName: matchedActivity.displayName,
                type: "out",
                timestamp: timestamp,
                location: matchedActivity.location,
                askstate: matchedActivity.askstate,
                plan: matchedActivity.plan,
                url: matchedActivity.url
            });

            
            this.elastic.save(saveobj);

            const { err, result } = this.dal.save(saveobj)
            if (err) {
                logger.error('save activity clock out unsuccessful', err)
                return 'save activity clock out unsuccessful ', err;
            }
            else {
                logger.info('save activity clock out successful');
                const sendClockout = await this.messageService.sendWalkInMessage(saveobj, userprofile);
                if (err) {
                    return err
                } return sendClockout;
            }
        }
    }
    else if(message.text != "No" && message.text != "Yes") {
        if (matchedActivity.plan === 'none' && matchedActivity.type === "in") { //if plan parameter equals to none then update an answer with incoming message 
            this.dal.update(schema, { userId: userId, type: 'in' }, { plan: message.text }, sortOption)
            matchedActivity.plan = message.text;
            this.elastic.save(matchedActivity);
            await this.messageService.sendWalkInMessage(matchedActivity, userprofile);
        }
        else if (matchedActivity.plan != 'none' && matchedActivity.type === "in") {
            await this.messageService.sendMessage(userId, alreadyAnswerMessage);
        }
    }
}

async function askTodayPlan(userId, location, schema, userprofile) { //send the question to users
    this.messageService.sendMessage(userId, 'what\'s your plan to do today at ' + location + ' ?');
    const updateCondition = { userId: userId, 'location.locationName': location, type: 'in' }

    const { err, result } = await this.dal.update(schema, updateCondition, { askstate: true }, sortOption)// update to mark as already ask question
    if (err) {
        logger.error('update unsuccessful', err)
        return 'update unsuccessful ', err;
    }
    else {
        logger.info('update successful');
        const call_callback = await this.callback(updateCondition, 0, schema, userprofile)
        if (err) {
            return err
        }
        return call_callback;
    }

}


async function callback(updateCondition, count, schema, userprofile) {  //handle when users do not answer question within 15 seconds

    return new Promise((resolve, reject) => {
        setTimeout(async () => {

            logger.debug(`call back for ${count} times`);
            var checkAns = await this.dal.find(updateCondition, schema, { _id: -1 }, 1)
            if (checkAns[0].plan === 'none' && count < 3) {
                // notify message for 3 times 
             //   this.messageService.sendMessage(userId, 'Please enter your answer');
                count = count + 1;
                let result = await this.callback(updateCondition, count, schema, userprofile);
                resolve(result);

            } else if (checkAns[0].plan === 'none' && count == 3) {
                // has notified for 3 times but no response
                await this.dal.update(schema, updateCondition, { plan: '           ' }, sortOption)
               // await this.messageService.sendWalkInMessage(checkAns[0], userprofile)
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