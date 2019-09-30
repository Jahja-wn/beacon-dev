import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import { userModel, activityModel, locationModel } from '../core/model';
import { LocalFile } from '../core/data_access_layer';
import { ConversationService, ElasticService, BeaconService, MessageService } from '../core/service';
import { Client, middleware } from '@line/bot-sdk';
import { logger, Log_config } from '../logger';
import { Router } from 'express'
import liff from './liff'
import { finalConfig } from '../../config';
mongoose.plugin(require('meanie-mongoose-to-json')); //change _id to id
const client = new Client(finalConfig);          // create LINE SDK clientconst bodyParser = require('body-parser');
const router = Router()
const dal = new LocalFile();
const elastic = new ElasticService();
const messageService = new MessageService(new Client(finalConfig));
const conversationService = new ConversationService(dal, messageService, elastic, finalConfig.AnswerAlertDuration);
const beaconService = new BeaconService(conversationService, messageService, dal, elastic);
const userColl = mongoose.model('users', userModel);
const locationColl = mongoose.model('locations', locationModel);
const activityColl = mongoose.model('activities', activityModel);


router.use('/liff', liff)

router.get('/history', bodyParser.json(), (req, res) => res.render('history'))

// webhook callback

router.post('/webhook', middleware(finalConfig), (req, res) => {
    // req.body.events should be an array of events
    if (!Array.isArray(req.body.events)) {
        logger.error(res);
        return res.status(500).end();
    }
    // handle events separately
    Promise.all(req.body.events.map(event => {
        logger.info(event);
        // check verify webhook event
        if (event.replyToken === '00000000000000000000000000000000' ||
            event.replyToken === 'ffffffffffffffffffffffffffffffff') {
            return;
        }
        return handleEvent(event);
    }))
        .then(() => res.end())
        .catch((err) => {
            logger.error(err);
            res.status(500).end();
        });
});

// callback function to handle a single event
async function handleEvent(event) {
    switch (event.type) {
        case 'message':
            var userprofile = await dal.find({ userId: event.source.userId }, userColl); // find users are they in a group member from database
            if (userprofile[0] != undefined) {
                return conversationService.handleInMessage(event.replyToken, event.message, event.source.userId, event.timestamp, activityColl, userprofile[0]);
            } else {
                return messageService.replyText(event.replyToken, `you aren't a group member`);
            }
        case 'follow':
            return messageService.replyText(event.replyToken, 'Got followed event');

        case 'unfollow':
            return logger.info(`Unfollowed this bot: ${JSON.stringify(event)}`);

        case 'postback':
            let data = event.postback.data;
            return messageService.replyText(event.replyToken, `Got postback: ${data}`);

        case 'join':
            return logge.info("bot join in ", event.source.groupId);

        case 'memberJoined': //when they join in group bot will send message to user for insert user information 
            return messageService.sendMessage(event.joined.members[0].userId, "please insert your information \n line://app/1588402264-zGXExoo1");

        case 'memberLeft':
            return;

        case 'leave':
            return logger.info(`Left: ${JSON.stringify(event)}`);

        case 'beacon':
            client.getProfile(event.source.userId)
                .then((profile) => {
                    beaconService.handleBeaconEvent(event.source.userId, profile.displayName, event.timestamp, event.beacon.hwid, profile.pictureUrl, userColl, locationColl, activityColl);
                }).catch((err) => {
                    logger.error(err);
                });
            return;

        default:
            logger.error(`Unknown event: ${JSON.stringify(event)}`);
    }
}


module.exports = router