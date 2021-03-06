// (function () { 'use strict'; }());
// import mongoose from 'mongoose';
// import db from '../../../src/database';
// import { userModel, activityModel, locationModel } from '../../../src/core/model';
// import { LocalFile } from '../../../src/core/data_access_layer';
// import { ConversationService, ElasticService } from '../../../src/core/service';
// import { mockMessageService } from '../utility/test_tool/mock';
// import { finalConfig } from '../../../config';
// db;
// const activityColl = mongoose.model('activities', activityModel);
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
// const dal = new LocalFile();
// const pushCalled = [];
// const callBackTimeout = 2000;
// var conversationService = new ConversationService(dal, mockMessageService(pushCalled), new ElasticService(), callBackTimeout);
// const activity = {
//     "userId": '1c',
//     "displayName": 'con',
//     "type": 'in',
//     "timestamp": 1568793470000,
//     "location": {
//         "hardwareID": '1',
//         "locationName": 'a',
//         "point": { "lat": 1, "lon": 1 }
//     },
//     "askstate": true,
//     "plan": 'Work',
//     "url": 'url'
// };
// const userprofile = {
//     "userId": "1c",
//     "displayName": "con",
//     "firstName": "service",
//     "lastName": "_",
//     "nickName": "spec",
// };
// describe('handleInMessage()', () => {
//     const forTest = {
//         "userId": "1c",
//         "displayName": "con",
//         "message": {
//             "type": "text",
//             "id": "21328934",
//             "text": "Yes"
//         },
//         "timestamp": 1568793470000,
//         "replytoken": 123
//     };

//     const clockoutactivity = {
//         "userId": '1c',
//         "displayName": 'con',
//         "type": 'out',
//         "timestamp": 1568793470000,
//         "location": {
//             "hardwareID": '1',
//             "locationName": 'a',
//             "point": { "lat": 1, "lon": 1 }
//         },
//         "askstate": true,
//         "plan": "Work",
//         "url": 'url'
//     };

//     beforeEach(async () => {
       
//         pushCalled.length = 0; //clear message queue
//         await activityColl.deleteMany({ "userId": "1c" });
//     });

//     it('when receive user message [plan] equal to none should send flex message to group', done => {
//         activity.plan = 'none'
//         forTest.message.text = "Work"
//         dal.save(new activityColl(activity)).then(() => {
//             conversationService.handleInMessage(forTest.replytoken, forTest.message, forTest.userId, forTest.timestamp, activityColl, userprofile).then(() => {
//                 activity.plan = "Work"
//                 expect(pushCalled).toEqual([{ toId: finalConfig.reportGroupId, message: conversationService.messageService.createWalkInMessage(activity, userprofile) }]);
//                 done();
//             }).catch(err => { console.log(err); done(); });
//         })
//     });

//     // it('when receive user message [plan] not equal to none should send reply message to user', done => {
//     // });


//     // it('when receive message "Yes" and user is not clock out yet it should send flex message to group', done => {
//     //     dal.save(new activityColl(activity)).then(() => {
//     //         conversationService.handleInMessage(forTest.replytoken, forTest.message, forTest.userId, forTest.timestamp, activityColl, userprofile).then(() => {
//     //             expect(pushCalled).toEqual([{ toId: finalConfig.reportGroupId, message: conversationService.messageService.createWalkInMessage(clockoutactivity, userprofile) }]);
//     //             done();
//     //         }).catch(err => { console.log(err); done(); });
//     //     })
//     // });

//     // it('when receive message "Yes" and user already clock out it should send reply message to user', done => {
//     //         conversationService.handleInMessage(forTest.replytoken, forTest.message, "2c", forTest.timestamp, activityColl, userprofile).then(() => {
//     //             // expect().toEqual("[{ toId: config.ReportGroupId, message: conversationService.messageService.createWalkInMessage(clockoutactivity, userprofile) }]");
//     //             done();
//     //     })
//     // });

//     // it('when recieve message with no activity in DB should not response anything', done => {
//     //     conversationService.handleInMessage(forTest.replytoken, forTest.message, forTest.userId, forTest.timestamp, activityColl, userprofile)
//     //         .then(() => {
//     //             expect(pushCalled).toEqual([]);
//     //             done();
//     //         }).catch(err => { console.log(err); done(); });
//     // });


//     // });
//     // // describe('conversation_service:', () => {
//     // //     describe('handleInMessage()', () => {
//     // //         const forTest = {
//     // //             "userId": "59010126",
//     // //             "name": "Ball",
//     // //             "message": {
//     // //                 "type": "text",
//     // //                 "id": "21328934",
//     // //                 "text": "work"
//     // //             }
//     // //         };
//     // //         beforeEach(() => {
//     // //             pushCalled.length = 0; //clear message queue
//     // //             resetDB();
//     // //         });

//     // //         it('when receive message from 1 exist matched user in DB should send flex message to group', done => {
//     // //             dal.save(new Activity(forTest.userId, forTest.name, 'in', new Date().getTime, 'BBL', true, 'none', 'url'));
//     // //             conversationService.handleInMessage(forTest.message, forTest.userId).then(() => {
//     // //                 expect(pushCalled).toEqual([{ toId: config.ReportGroupId, message: conversationService.messageService.createWalkInMessage(new Activity(forTest.userId, forTest.name, 'in', new Date().getTime(), 'BBL', true, forTest.message.text, 'url')) }]);
//     // //                 done();
//     // //             }).catch(err => { console.log(err); done(); });
//     // //         });

//     // //         it('when recieve message with no activity in DB should not response anything', done => {
//     // //             conversationService.handleInMessage(forTest.message, forTest.userId)
//     // //                 .then(() => {
//     // //                     expect(pushCalled).toEqual([]);
//     // //                     done();
//     // //                 }).catch(err => { console.log(err); done(); });
//     // //         });

//     // //         it('when receive user message but [plan] of latest activity of user exist should send message that user had answered the question', done => {
//     // //             dal.save(new Activity(forTest.userId, forTest.name, 'in', new Date().getTime, 'BBL', true, 'Do some work', 'url'));
//     // //             conversationService.handleInMessage(forTest.message, forTest.userId).then(() => {
//     // //                 expect(pushCalled).toEqual([{ toId: forTest.userId, message: { type: 'text', text: "you already have answered the question" } }]);
//     // //                 done();
//     // //             }).catch(err => { console.log(err); done(); });

//     // //         });
//     // //     });


//     // //     describe("callback()", () => {

//     // //         const forTest3 = {
//     // //             "userId": "590111178",
//     // //             "name": "Jahja",
//     // //             "location": {
//     // //                 "hardwareID": "012e99fb46",
//     // //                 "locationName": "Chidlom Site",
//     // //                 "point": {
//     // //                     "lat": 13.740472,
//     // //                     "lon": 100.54297
//     // //                 }
//     // //             }
//     // //         };
//     // //         const forTest4 = {
//     // //             "userId": "590111111",
//     // //             "name": "jam",
//     // //             "location": {
//     // //                 "hardwareID": "012e99fb46",
//     // //                 "locationName": "Chidlom Site",
//     // //                 "point": {
//     // //                     "lat": 13.740472,
//     // //                     "lon": 100.54297
//     // //                 }
//     // //             }
//     // //         };
//     // //         beforeEach(() => {
//     // //             pushCalled.length = 0; //clear message queue
//     // //             resetDB();
//     // //         });

//     // //         it('when receive no message comming within Alert duration should warning message for 3 round and send flexmessage to group', done => {
//     // //             dal.save(new Activity(forTest3.userId, forTest3.name, 'in', new Date().getTime, forTest3.location.locationName, true, 'none', '123444'));
//     // //             conversationService.callback(forTest3.userId, forTest3.location.locationName, 0).then(() => {
//     // //                 expect(pushCalled).toEqual([{ toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } }, { toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } }, { toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } }, { toId: config.ReportGroupId, message: conversationService.messageService.createWalkInMessage(new Activity(forTest3.userId, forTest3.name, 'in', new Date().getTime(), "Chidlom Site", true, '           ', '123444')) }]);
//     // //                 done();
//     // //             }).catch(err => { console.log(err); done(); });
//     // //         });

//     // //         it('when user arrive 2 people it should warning message 6 times and send flex message 2 times', done => {


//     // //             let user1MessageList = [
//     // //                     { toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //                     { toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //                     { toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //                     { toId: config.ReportGroupId, message: conversationService.messageService.createWalkInMessage(new Activity(forTest3.userId, forTest3.name, 'in', new Date().getTime(), "Chidlom Site", true, '           ', '123444')) }               
//     // //                 ];
//     // //             let user2MessageList = [
//     // //                     { toId: forTest4.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //                     { toId: forTest4.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //                     { toId: forTest4.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //                     { toId: config.ReportGroupId, message: conversationService.messageService.createWalkInMessage(new Activity(forTest4.userId, forTest4.name, 'in', new Date().getTime(), "Chidlom Site", true, '           ', '123444')) }               
//     // //                 ];

//     // //            const  pushCalled = [
//     // //             { toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //             { toId: forTest4.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //             { toId: forTest4.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //             { toId: forTest4.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //             { toId: config.ReportGroupId, message: conversationService.messageService.createWalkInMessage(new Activity(forTest4.userId, forTest4.name, 'in', new Date().getTime(), "Chidlom Site", true, '           ', '123444')) },               

//     // //             { toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //             { toId: forTest3.userId, message: { type: 'text', text: "Please enter your answer" } }, 
//     // //             { toId: config.ReportGroupId, message: conversationService.messageService.createWalkInMessage(new Activity(forTest3.userId, forTest3.name, 'in', new Date().getTime(), "Chidlom Site", true, '           ', '123444')) }               

//     // //             ];    
//     // //             dal.save(new Activity(forTest3.userId, forTest3.name, 'in', new Date().getTime, forTest3.location.locationName, true, 'none', '123444'));
//     // //             dal.save(new Activity(forTest4.userId, forTest4.name, 'in', new Date().getTime, forTest4.location.locationName, true, 'none', '123444'));

//     // //             conversationService.callback(forTest3.userId, forTest3.location.locationName, 0).catch(err => { console.log(err); done(); });
//     // //             conversationService.callback(forTest4.userId, forTest4.location.locationName, 0).catch(err => { console.log(err); done(); });
//     // //             setTimeout(()=>{
//     // //                 let checkIdxUser1 = 0;
//     // //                 let checkIdxUser2 = 0;
//     // //                 console.log(pushCalled.length);
//     // //                 console.log(pushCalled);
//     // //                 for(var i =0;i< pushCalled.length;i++){
//     // //                     //expect([user1MessageList[checkIdxUser1],user2MessageList[checkIdxUser2]]).toContain(pushCalled[i]);
//     // //                     if(lodash.isEqual(pushCalled[i],user1MessageList[checkIdxUser1])){
//     // //                         checkIdxUser1++;
//     // //                     }
//     // //                     else if(lodash.isEqual(pushCalled[i],user2MessageList[checkIdxUser2])){
//     // //                         checkIdxUser2++;
//     // //                     }
//     // //                     else{

//     // //                        throw "assert fail => Message not match in either user 1 or user 2";
//     // //                     }
//     // //                 }

//     // //                 expect(checkIdxUser1).toEqual(user1MessageList.length);
//     // //                 expect(checkIdxUser2).toEqual(user2MessageList.length);
//     // //                 done();
//     // //             },callBackTimeout*6);

//     // //         });

//     // //     });

// });
