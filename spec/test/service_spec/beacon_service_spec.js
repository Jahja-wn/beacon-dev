(function () { 'use strict'; }());
import mongoose from 'mongoose'
import { BeaconService, ConversationService, MessageService, ElasticService } from '../../../src/core/service'
import { LocalFile } from '../../../src/core/data_access_layer';
import { userModel, activityModel, locationModel } from '../../../src/core/model';
import { mockMessageService } from '../utility/test_tool/mock';
import config from 'config';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
const dal = new LocalFile();
const pushCalled = [];
const msgService = mockMessageService(pushCalled)
const connService = new ConversationService(dal, msgService, new ElasticService(), callBackTimeout);
const beaconService = new BeaconService(connService, msgService, dal);
const callBackTimeout = 2000;
const userColl = mongoose.model('users', userModel);
const locationColl = mongoose.model('locations', locationModel);
const activityColl = mongoose.model('activities', activityModel);

describe('beaconService', () => {

    const activity = {
        "userId": '1b',
        "displayName": 'beacon',
        "type": 'in',
        "timestamp": 1564982156347,
        "location": {
            "hardwareId": "1",
            "locationName": "a",
            "point": { "lat": "13.733014", "lon": "100.56029" }
        },
        "askstate": true,
        "plan": '',
        "url": 'url'
    };
    const userprofile = {
        "userId": "1b",
        "displayName": "beacon",
        "firstName": "service",
        "lastName": "_ ",
        "nickName": "spec"
    };
    const forTest3 = {
        "userId": "59010126",
        "name": "Ball",
        "timestamp": 1564982156347,
        "hardwareID": "012c7cbf02",
        "url": "url"

    }
    beforeEach(() => {
        pushCalled.length = 0; //clear message queue
        activityColl.deleteMany({ "userId": "1b" });
    });


    it(' when user has access first time it should send question to user ', done => {


        beaconService.handleBeaconEvent(activity.userId, activity.displayName, activity.timestamp, activity.location.hardwareId, activity.url, userColl, locationColl, activityColl)
            .then(() => {
                expect(pushCalled).toEqual([{ toId: activity.userId, message: { type: 'text', text: 'what\'s your plan to do today at a ?' } },
                { toId: activity.userId, message: { type: 'text', text: "Please enter your answer" } },
                { toId: activity.userId, message: { type: 'text', text: "Please enter your answer" } },
                { toId: activity.userId, message: { type: 'text', text: "Please enter your answer" } },
                { toId: config.ReportGroupId, message: connService.messageService.createWalkInMessage(activity, userprofile) }]);
                done();
            }).catch(err => { console.log(err); done(); });
        done();


    });

    //     // describe('beaconService', () => {
    //     //     const forTest2 = {
    //     //         "userId": "5901",
    //     //         "name": "ja",
    //     //         "timestamp": 1564982156347,
    //     //         "hardwareID": "012c7cbf02",
    //     //         "url": "url"

    //     //     }
    //     //     const forTest3 = {
    //     //         "userId": "59010126",
    //     //         "name": "Ball",
    //     //         "timestamp": 1564982156347,
    //     //         "hardwareID": "012c7cbf02",
    //     //         "url": "url"

    //     //     }


    //     //     beforeEach(() => {
    //     //         pushCalled.length = 0; //clear message queue
    //     //         resetDB();
    //     //     });


    //     //     it(' when user has access first time it should send question to user ', done => {

    //     //         dal.save(new Location("012c7cbf02", "aaa", { lat: 11.11, lon: 222.22 }));
    //     //         dal.save(new User(forTest3.userId, forTest3.name));


    //     //         beaconService.handleBeaconEvent(forTest3.userId, forTest3.name, forTest3.timestamp, forTest3.hardwareID, forTest3.url).then(() => {
    //     //             expect(pushCalled).toEqual([{ toId: forTest3.userId, message: { type: 'text', text: 'what\'s your plan to do today at aaa ?' } },
    //     //             { toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } },
    //     //             { toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } },
    //     //             { toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } },
    //     //             { toId: config.ReportGroupId, message: conversationService.messageService.createWalkInMessage(new Activity(forTest3.userId, forTest3.name, 'in', new Date().getTime(), "Chidlom Site", true, '           ', '123444')) }]);
    //     //             done();
    //     //         }).catch(err => { console.log(err); done(); });
    //     //         done();


    //     //     });
    //     //ต้อง test ทีละเงื่อนไข

    //     // it(' should send message to group if user become active again in the same location when call send messagge sevice', done => {
    //     //     dal.save(new Location("012c7cbf02", "aaa", { lat: 11.11, lon: 222.22 }));
    //     //     dal.save(new User("590101111", "jing"));
    //     //     dal.save(new Activity("590101111", "jing", "in", 1564982156347, new Location("012c7cbf02", "aaa", { lat: 11.11, lon: 222.22 }), true, "work", "url"));
    //     //     beaconService.handleBeaconEvent("590101111", "jing", 1564982156347, "012c7cbf02", "url").then(() => {
    //     //         expect(pushCalled).toEqual([{ toId: config.ReportGroupId, message: { type: 'text', text: "jing re-enter aaa" } }]);
    //     //         done();
    //     //     }).catch(err => { console.log(err); done(); });
    //     //     done();
    //     // });
});