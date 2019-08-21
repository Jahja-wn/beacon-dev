'use strict';
import { Elastic_service } from '../../service/index'
import { Activity, User } from '../../model/index'

var elastic = new Elastic_service();
const current_datetime = new Date();

describe('callback', () => {


    it('should save user by save function', () => {
        var user = new User("9f12e85f8a0d10571a4af43eacd9e127", "..BALL..");
        elastic.elasticsave(user).then((res) => {
            expect(res._index).toEqual("user");
            expect(res.result).toEqual("created");
        });
    });


    it('should save activity by save function', async (done) => {
        var activity = new Activity("9f12e85f8a0d10571a4af43eacd9e127", "..BALL..", "in", "1234567", "testLocation", "none", "none");
        elastic.elasticsave(activity).then((res) => {
            expect(res._index).toEqual('activity-' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear());
            expect(res.result).toEqual("created");

        });
        done();
    });


    it('should update askstate of activity by update function', async (done) => {
        var activity = new Activity("9f12e85f8a0d10571a4af43eacd9e127", "..BALL..", "in", "1234567", "testLocation", "none", "none");
        await elastic.elasticsave(activity);
        var obj = new Activity("9f12e85f8a0d10571a4af43eacd9e127", null, null, null, "testLocation", true, null);
        await elastic.elasticupdate(obj, 'askstate').then((res) => {
            expect(res.updated).not.toEqual(0);
        });
        done();
    });


    it('should update plan of activity by update function', async (done) => {
        var activity = new Activity("9f12e85f8a0d10571a4af43eacd9e127", "..BALL..", "in", "1234567", "testLocation", "none", "none");
        await elastic.elasticsave(activity);
        var obj = new Activity("9f12e85f8a0d10571a4af43eacd9e127", null, null, null, "testLocation", null,"Hello");
        elastic.elasticupdate(obj,'plan').then((res) => {
            expect(res.updated).not.toEqual(0);
        });
        done();
    });

});