import mongoose from 'mongoose'
import { userModel, activityModel, locationModel } from '../core/model';
import { LocalFile } from '../core/data_access_layer';
import { ConversationService, ElasticService, BeaconService, MessageService } from '../core/service';
import { Client, middleware } from '@line/bot-sdk';
import { logger, Log_config } from '../logger';
import config from '../core/config';
import { Router } from 'express'
import liff from './liff'


const router = Router()
const client = new Client(config);          // create LINE SDK client
const dal = new LocalFile();
const elastic = new ElasticService();
const messageService = new MessageService(new Client(config));
const conversationService = new ConversationService(dal, messageService, elastic, config.AnswerAlertDuration);
const beaconService = new BeaconService(conversationService, messageService, dal, elastic);

const toJson = require('@meanie/mongoose-to-json');
mongoose.plugin(toJson);

const userColl = mongoose.model('users', userModel);
const locationColl = mongoose.model('locations', locationModel);
const activityColl = mongoose.model('activities', activityModel);

router.use('/liff', liff)

router.get('/history', (req, res) => res.render('history'))

// webhook callback
router.post('/webhook', middleware(config), (req, res) => {
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

// simple reply function
const replyText = (token, texts) => {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
        token,
        texts.map((text) => ({ type: 'text', text }))
    );
};

// callback function to handle a single event
async function handleEvent(event) {
    switch (event.type) {
        case 'message':
            var userprofile = await dal.find({ userId: event.source.userId }, userColl);
            if (userprofile[0] != undefined) {
                return conversationService.handleInMessage(event.message, event.source.userId,event.timestamp, activityColl, userprofile[0],replyText);
            } else { return replyText(event.replyToken, `you aren't a group member`); }
        case 'follow':
            return replyText(event.replyToken, 'Got followed event');

        case 'unfollow':
            return logger.info(`Unfollowed this bot: ${JSON.stringify(event)}`);

        case 'postback':
            let data = event.postback.data;
            return replyText(event.replyToken, `Got postback: ${data}`);

        case 'join':
            return logge.info("bot join in ", event.source.groupId);

        case 'memberJoined':
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