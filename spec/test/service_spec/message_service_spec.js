(function () { 'use strict'; }());
import { MessageService } from '../../../src/core/service';
var messageService = new MessageService();
import moment from 'moment';
import { mockLineClient } from '../utility/test_tool/mock';
import {finalConfig} from '../../../config';
const pushCalled = [];

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
var profile = {
    userId: 'Ub182adba86d289c7154a6963e725c4f5',
    displayName: 'jam',
    pictureUrl: 'https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e'
};
messageService.client = mockLineClient(pushCalled, profile);

describe('message_service', () => {
    describe('sendMessage()', () => {
        it('should send message to userId when called', done => {
            pushCalled.length = 0; // this line will empty pushCalled List
            messageService.sendMessage("1234", "hello").then(() => {
                expect(pushCalled).toEqual([{ toId: "1234", message: { type: "text", text: "hello" } }]);
                done();
            });
        });
    });

    describe('sendFlexMessage()', () => {
        var activity = {
            userId: "Ub182adba86d289c7154a6963e725c4f5",
            displayName: "jam",
            type: "in",
            timestamp: 1562834628816,
            location: {
                hardwareID: "012f6c1f6f",
                locationName: "Dimension Data Office, Asok",
                point:
                {
                    lat: 13.733014,
                    lon: 13.733014
                }
            },
            plan: "none",
            url: "https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e"
        };
        var userprofile = {
            userId: "Ub182adba86d289c7154a6963e725c4f5",
            displayName: "jam",
            firstName: "aaaaa",
            lastName: "bbbbbb",
            nickName: "Jam"
        };

        it('when create flex message using profile and activity result should be correct', () => {
            var walkInMessage = messageService.createWalkInMessage(activity, userprofile);
            expect(walkInMessage.contents.hero.url).toEqual('https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e');
            expect(walkInMessage.contents.body.contents[0].text).toEqual("jam (Jam)");
            expect(walkInMessage.contents.body.contents[1].contents[0].contents[1].text).toEqual(moment(1562834628816).format('MMMM Do YYYY, h:mm:ss a'));
            expect(walkInMessage.contents.body.contents[1].contents[1].contents[1].text).toEqual('in');
            expect(walkInMessage.contents.body.contents[1].contents[2].contents[1].text).toEqual('Dimension Data Office, Asok');
            expect(walkInMessage.contents.body.contents[1].contents[3].contents[1].text).toEqual('none');
        });

        it('when send flex message with delay in function send message result should handle delay and send message to correct user', done => {
            pushCalled.length = 0;
            messageService.sendWalkInMessage(activity, userprofile).then(() => {
                expect(pushCalled[0].toId).toEqual(finalConfig.reportGroupId);
                expect(pushCalled[0].message.contents.hero.url).toEqual('https://profile.line-scdn.net/0m01069df87251aea554672fcdde287efeb6dceb87891e');
                expect(pushCalled[0].message.contents.body.contents[0].text).toEqual("jam (Jam)");
                expect(pushCalled[0].message.contents.body.contents[1].contents[0].contents[1].text).toEqual(moment(1562834628816).format('MMMM Do YYYY, h:mm:ss a'));
                expect(pushCalled[0].message.contents.body.contents[1].contents[1].contents[1].text).toEqual('in');
                expect(pushCalled[0].message.contents.body.contents[1].contents[2].contents[1].text).toEqual('Dimension Data Office, Asok');
                expect(pushCalled[0].message.contents.body.contents[1].contents[3].contents[1].text).toEqual('none');
                done();
            }).catch(err => { console.log(err); });
        });

    });
    describe('sendConfirmMessage()', () => {
        it('should send confirm message to userId when called', done => {
            pushCalled.length = 0; // this line will empty pushCalled List
            messageService.sendConfirmMessage("1234").then(() => {
                expect(pushCalled[0].toId).toEqual('1234');
                expect(pushCalled[0].message.altText).toEqual('this is a confirm template');
                done();
            });
        });
    });

    // describe('replytext', () => {
    //     // it('should send confirm message to userId when called', done => {
    //     //     pushCalled.length = 0; // this line will empty pushCalled List
    //     //     messageService.sendConfirmMessage("1234").then(() => {
    //     //         expect(pushCalled[0].toId).toEqual('1234');
    //     //         expect(pushCalled[0].message.altText).toEqual('this is a confirm template');
    //     //         done();
    //     //     });
    //     // });
    // });

});