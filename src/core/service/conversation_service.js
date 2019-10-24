(function () { 'use strict'; }());
import { setTimeout } from 'timers';
import { logger } from '../../logger';
import moment from 'moment'

// handle when received messages
async function handleInMessage(replytoken, message, userId, timestamp, schema, userprofile) {


    var filter = {
        userId: userId,
        clockin: {
            $gte: moment().startOf('day'),
            $lte: moment().endOf('day')
        }
    }

    var matchedActivities = await this.dal.find(filter, schema, { '_id': 'desc' }, 0);       // Find matches activity in each day by using userId 
    let matchedActivity = matchedActivities[0];
    logger.debug("handle in message", matchedActivities)

    const mongooseobj = {
        userId: matchedActivity.userId,
        displayName: matchedActivity.displayName,
        type: "out",
        clockin: matchedActivity.clockin,
        clockout: timestamp,
        location: matchedActivity.location,
        askstate: matchedActivity.askstate,
        plan: matchedActivity.plan,
        url: matchedActivity.url
    };

    const update_elasticformat = {
        userId: null,
        displayName: null,
        type: null,
        clockin: null,
        clockout: null,
        location: null,
        askstate: null,
        plan: null,
        url: null
    };

    // consider the user will clock out or not
    if (message.text === "Yes" && matchedActivity != undefined) {                               // if received message is "yes", mean user wants to clock out 
        if (matchedActivity.clockout != null) {                                                   // it means user has already clocked out
            logger.info(`handleInMessage -> userid: ${userId} have already clocked out`);
            this.messageService.replyText(replytoken, "you have already clocked out");

        } else {
            try {
                await this.dal.update(schema, filter, { type: "out", clockout: timestamp }, { new: true, sort: { "_id": -1 } })
                logger.info('handleInMessage save clocked out activity successful');
                await this.messageService.sendWalkInMessage(mongooseobj, userprofile);
                update_elasticformat.userId = matchedActivity.userId
                update_elasticformat.clockin = mongooseobj.clockin.getTime()
                update_elasticformat.clockout = timestamp
                await this.elastic.update(update_elasticformat, 'clockout')
            }

            catch (err) {
                logger.error('handleInMessage save clocked out activity unsuccessful', err)
                return 'handleInMessage save clocked out activity unsuccessful', err;
            }
        }
    }
    else if (message.text != "Yes" && message.text != "No" && matchedActivity != undefined) {
        if (matchedActivity.plan === 'none') {              //if plan parameter equals to none then update an answer with incoming message 
            logger.info(`handleInMessage, bot already asked but userid: ${userId} do not answer the question yet`);
            let update_plan = await this.dal.update(schema, { userId: userId }, { plan: message.text }, { new: true, sort: { "_id": -1 } })
            await this.messageService.sendWalkInMessage(update_plan, userprofile);

            const activity = update_plan.toJSON();
            activity.clockin = activity.clockin.getTime()
            await this.elastic.save(activity);                // mapping these data into elasticsearch
        }
        else if (matchedActivity.plan != 'none') {
            logger.info(`handleInMessage, bot already asked but userid: ${userId} already have answered `);
            this.messageService.replyText(replytoken, 'you already have answered the question');
        }
    }
}

async function askTodayPlan(userId, location, schema, userprofile) {
    this.messageService.sendMessage(userId, 'what\'s your plan to do today at ' + location + ' ?');             // send question to user
    const updateCondition = { userId: userId, 'location.locationName': location }

    try {
        await this.dal.update(schema, updateCondition, { askstate: true }, { new: true, sort: { "_id": -1 } })                             // update to mark as already ask question
        logger.info('askTodayPlan update asktate successful');

        try {
            const call_callback = await this.callback(userId, updateCondition, 0, schema, userprofile)
            return call_callback;
        }
        catch (err) {
            return err
        }
    }
    catch (err) {
        logger.error('askTodayPlan update asktate unsuccessful', err)
        return 'update unsuccessful ', err;
    }

}


async function callback(userId, updateCondition, count, schema, userprofile) {                             //handle when users do not answer question within 5 seconds
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            logger.debug(`call back for ${count} times`);
            var checkAns = await this.dal.find(updateCondition, schema, { '_id': 'desc' }, 1)
            logger.debug("check", checkAns[0])
            if (checkAns[0].plan === 'none' && count < 3) {
                this.messageService.sendMessage(userId, 'Please enter your answer');                     // notify message for 3 times 
                count = count + 1;
                let result = await this.callback(userId, updateCondition, count, schema, userprofile);
                resolve(result);

            } else if (checkAns[0].plan === 'none' && count == 3) {
                const updatefromCallback = await this.dal.update(schema, updateCondition, { plan: '           ' }, { new: true, sort: { "_id": -1 } })        // has notified for 3 times but no response
                const activity = updatefromCallback.toJSON();
                activity.clockin = activity.clockin.getTime()
                await this.elastic.save(activity);                // mapping these data into elasticsearch

                try {
                    await this.messageService.sendWalkInMessage(updatefromCallback, userprofile)
                    resolve("update answer and exist loop from conver,callback");
                }
                catch (err) {
                    reject(err)
                }
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
