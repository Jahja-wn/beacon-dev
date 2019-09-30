import server from "../../src/app"
import { userModel, activityModel } from "../../src/core/model"
import { LocalFile } from '../../src/core/data_access_layer'
import mongoose from 'mongoose'
const userColl = mongoose.model('users', userModel);
const activityColl = mongoose.model('activities',activityModel)
const request = require("supertest");
const dal = new LocalFile();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;


describe('test api /liff ', () => {
    beforeEach(async () => {
        await userColl.deleteMany({ "userId": "1l", "userId": "2l" });
        await activityColl.deleteMany({  "userId": "2l" });

    });
    const userprofile = {
        "userId": "2l",
        "displayName": "save",
        "firstName": "data",
        "lastName": "user",
        "nickName": "profile",
    };


    describe("POST /", () => {

        it("should save user's info and return userinfo when call post /submit in case of data not exist ", async () => {
            const res = await request(server)
                .post("/liff/submit")
                .send({
                    "userId": "1l",
                    "displayName": "liff",
                    "firstName": "save",
                    "lastName": "not",
                    "nickName": "exist"
                })

            expect(res.status).toEqual(200);
            expect((Object.keys(res.body))).toContain("userId", "displayName", "firstName", "lastName", "nickName", "id");
            expect(res.body.userId).toEqual("1l");
            expect(res.body.displayName).toEqual("liff");
            expect(res.body.firstName).toEqual("save");
            expect(res.body.lastName).toEqual("not");
            expect(res.body.nickName).toEqual("exist");
        });

        it("should update user's info return user when call post /submit in case of data exist ", async () => {

            dal.save(new userColl(userprofile));
            const res = await request(server)
                .post("/liff/submit")
                .send({
                    "userId": "2l",
                    "displayName": "liff",
                    "firstName": "update",
                    "lastName": "data",
                    "nickName": "existed"
                })


            expect(res.status).toEqual(200);
            expect((Object.keys(res.body))).toContain("userId", "displayName", "firstName", "lastName", "nickName", "id");
            expect(res.body.userId).toEqual("2l");
            expect(res.body.displayName).toEqual("liff");
            expect(res.body.firstName).toEqual("update");
            expect(res.body.lastName).toEqual("data");
            expect(res.body.nickName).toEqual("existed");
        });

        it("should return status 200 when call post /gethistory in case of data exist ", async () => {
            const activity = {
                "userId": '2l',
                "displayName": 'liff',
                "type": "in",
                "timestamp": new Date(),
                "location": {
                    "hardwareID": '1',
                    "locationName": 'a',
                    "point": { "coordinates": [1, 1] }
                },
                "askstate": true,
                "plan": 'aaa',
                "url": 'url'
            };
            dal.save(new activityColl(activity))

            const res = await request(server)
                .post("/liff/gethistory")
                .send({
                    "userId": "2l",
                })
            expect(res.status).toEqual(200);

        });
        it("should return status 201 when call post /gethistory in case of data not exist ", async () => {
            const res = await request(server)
                .post("/liff/gethistory")
                .send({
                    "userId": "3l",
                })
            expect(res.status).toEqual(201);

        });

    });
});
