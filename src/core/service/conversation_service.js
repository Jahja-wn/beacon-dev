(function () { 'use strict'; }());
import { Activity } from '../model';
import { setTimeout } from 'timers';
import config from '../config';
import { logger } from '../../logger';


const alreadyAnswerMessage = {
    type: 'text',
    text: 'you already have answered the question'
};

//handle when messages were sent
async function handleInMessage(message, userId) {
    var matchedActivities = this.dal.find(new Activity(userId, null, null, null, null, true, null, null), 1, true);

    // Find for checking if user sending message is one we waiting for response(ask state = true)
    if (matchedActivities.length > 0) {
        let matchedActivity = matchedActivities[0];
        if (matchedActivity.plan === 'none') {
            //if plan parameter equals to none then updated an answer with incomeing message 
            this.dal.update({ plan: message.text }, null, matchedActivity);
            matchedActivity.plan = message.text;
            this.elastic.save(matchedActivity);
            await this.messageService.sendWalkInMessage(matchedActivity);
        }
        else {
            await this.messageService.sendMessage(userId, alreadyAnswerMessage);
        }
    } else {
        //will go into this when user send message to bot out of context
        return;
    }
}

function askTodayPlan(userId, location) { //send the question to users
    this.messageService.sendMessage(userId, 'what\'s your plan to do today at ' + location+ ' ?');
    // update to mark as already ask question
    this.dal.update({ askstate: true }, null, new Activity(userId, null, null, null, location, null, null, null));
    return new Promise((resolve) => {
        this.callback(userId, location, 0);
    });
}


function callback(userId, location, count) {  //handle when users do not answer question within 15 seconds

    return new Promise(resolve => {
        setTimeout(() => {
            logger.debug(`call back for ${count} times`);
            var checkAnswer = new Activity(userId, null, null, null, location, null, null, null);
            var checkAns = this.dal.find(checkAnswer, 1, true)

            if (checkAns[0].plan === 'none' && count < 3) {

                this.messageService.sendMessage(userId, 'Please enter your answer');
                count = count + 1;
                this.callback(userId, location, count).then(() => { 
                    resolve(); });

            } else if (checkAns[0].plan === 'none' && count == 3) {
                //var updateAnswer = new Activity(userId, null, null, null, location, null, '           ', null);  // has notified for 3 times but no response

                this.dal.update({ plan: '           ' }, false, checkAns[0]);
                checkAns[0].plan = '           ';
                this.messageService.sendWalkInMessage(checkAns[0])
                .then(() => {
                        resolve(); }
                ).catch(err => { 
                    logger.error(err); 
                    resolve()
                });
            }
            else if (checkAns[0].plan != 'none') {
                console.log("exist loop from conver,callback");
                resolve();
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