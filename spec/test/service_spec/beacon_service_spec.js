(function () { 'use strict'; }());
import mongoose from 'mongoose';
import { logger } from '../../../src/logger'
import db from '../../../src/database';
import { userModel, activityModel, locationModel } from '../../../src/core/model';
import { LocalFile } from '../../../src/core/data_access_layer';
import { ConversationService, ElasticService, BeaconService, MessageService } from '../../../src/core/service';
import { mockMessageService } from '../utility/test_tool/mock';
import { finalConfig } from '../../../config';
db;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
const dal = new LocalFile();
const pushCalled = [];
const callBackTimeout = 2000;
const msgService = mockMessageService(pushCalled)
const connService = new ConversationService(dal, msgService, new ElasticService(), callBackTimeout);
const beaconService = new BeaconService(connService, msgService, dal);
const userColl = mongoose.model('users', userModel);
const activityColl = mongoose.model('activities', activityModel);
const locationColl = mongoose.model('locations', locationColl);

describe('beaconService', () => {

    const activity = {
        "userId": '1b',
        "displayName": 'beacon',
        "type": "in",
        "timestamp": new Date(),
        "location": {
            "hardwareID": '1',
            "locationName": 'a',
            "point": { "coordinates": [1, 1] }
        },
        "askstate": true,
        "plan": '           ',
        "url": 'url'
    };
    const userprofile = {
        "userId": "1b",
        "displayName": "beacon",
        "firstName": "service",
        "lastName": "_ ",
        "nickName": "spec"
    };
    beforeEach(async () => {
        pushCalled.length = 0; //clear message queue
        await activityColl.deleteMany(
            { "userId": "1b" },
            { "userId": "2b" }
        );
    });


    it(' when user has access first time it should send question to user ', async () => {
        await beaconService.handleBeaconEvent(activity.userId, activity.displayName, activity.timestamp, activity.location.hardwareID, activity.url, userColl, locationColl, activityColl)
        expect(pushCalled).toEqual([{ toId: activity.userId, message: { type: 'text', text: 'what\'s your plan to do today at a ?' } },
        { toId: activity.userId, message: { type: 'text', text: "Please enter your answer" } },
        { toId: activity.userId, message: { type: 'text', text: "Please enter your answer" } },
        { toId: activity.userId, message: { type: 'text', text: "Please enter your answer" } },
        { toId: finalConfig.reportGroupId, message: connService.messageService.createWalkInMessage(activity, userprofile) }
        ]);

    });

    it(' should send confirm message to user  if user become active again in the same location when call send messagge sevice', async () => {
        activity.userId = "2b"
        dal.save(new activityColl(activity));
        await beaconService.handleBeaconEvent(activity.userId, activity.displayName, activity.timestamp, activity.location.hardwareID, activity.url, userColl, locationColl, activityColl)
        expect(pushCalled).toEqual([ { toId: activity.userId, message: connService.messageService.confirmMessage()}] );

    });
});