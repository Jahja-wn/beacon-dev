(function () { 'use strict'; }());
import { setTimeout } from 'timers';
import { logger } from '../../logger';
import moment from 'moment'

const today = moment().startOf('day')

// handle when received messages
async function handleInMessage(replytoken, message, userId, timestamp, schema, userprofile) {
    var filter = {
        userId: userId,
        timestamp: {
            $gte: today.toDate(),
            $lte: moment(today).endOf('day').toDate()
        }
    }
    var matchedActivities = await this.dal.find(filter, schema, { '_id': 'desc' }, 1)           // Find matches activity in each day by using userId 
    let matchedActivity = matchedActivities[0];
    logger.debug("handle in message", matchedActivity)

    // consider the user will clock out or not 
    if (message.text === "Yes" && matchedActivity != undefined) {                               // if received message is "yes", mean user wants to clock out 
        if (matchedActivity.type === "out") {                                                   // it means user has already clocked out
            logger.info(`handleInMessage -> userid: ${userId} have already clocked out`);
            this.messageService.replyText(replytoken, "you have already clocked out");

        } else {
            const saveobj = {
                userId: matchedActivity.userId,
                displayName: matchedActivity.displayName,
                type: "out",
                timestamp: timestamp,
                location: matchedActivity.location,
                askstate: matchedActivity.askstate,
                plan: matchedActivity.plan,
                url: matchedActivity.url
            };


            this.elastic.save(saveobj);                                                          // mapping these data into elasticsearch

            try {
                await this.dal.save(new schema(saveobj))
                logger.info('handleInMessage save clocked out activity successful');
                const { err, sendClockout } = await this.messageService.sendWalkInMessage(saveobj, userprofile);
                if (err) {
                    return logger.info('error when send clocked out message', err);
                } return sendClockout;
            }
            catch (err) {
                logger.error('handleInMessage save clocked out activity unsuccessful', err)
                return 'save clock out activity  unsuccessful ', err;
            }

            // const { err, result } = this.dal.save(new schema(saveobj))
            // if (err) {
            //     logger.error('handleInMessage save activity clock out unsuccessful', err)
            //     return 'save activity clock out unsuccessful ', err;
            // }
            // else {
            //     logger.info('handleInMessage save activity clock out successful');
            //     const sendClockout = await this.messageService.sendWalkInMessage(saveobj, userprofile);
            //     if (err) {
            //         return err
            //     } return sendClockout;
            // }
        }
    }
    else if (message.text != "Yes" && matchedActivity != undefined) {
        if (matchedActivity.plan === 'none' && matchedActivity.type === "in") {              //if plan parameter equals to none then update an answer with incoming message 
            logger.info(`handleInMessage, bot already asked but userid: ${userId} do not answer the question yet`);
            this.dal.update(schema, { userId: userId, type: 'in' }, { plan: message.text }, { new: true, sort: { "_id": -1 } })
            matchedActivity.plan = message.text;
            this.elastic.save(matchedActivity);
            await this.messageService.sendWalkInMessage(matchedActivity, userprofile);
        }
        else if (matchedActivity.plan != 'none' && matchedActivity.type === "in") {
            logger.info(`handleInMessage, bot already asked but userid: ${userId} already have answered `);
            this.messageService.replyText(replytoken, 'you already have answered the question');
        }
    }
}

async function askTodayPlan(userId, location, schema, userprofile) {
    this.messageService.sendMessage(userId, 'what\'s your plan to do today at ' + location + ' ?');             // send question to user
    const updateCondition = { userId: userId, 'location.locationName': location, type: 'in' }

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
                await this.dal.update(schema, updateCondition, { plan: '           ' }, { new: true, sort: { "_id": -1 } })        // has notified for 3 times but no response
                checkAns[0].plan = '           ';
                try {
                    await this.messageService.sendWalkInMessage(checkAns[0], userprofile)
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