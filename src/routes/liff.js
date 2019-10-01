import { Router } from 'express'
import mongoose from 'mongoose'
import { userModel, activityModel, locationModel } from '../core/model'
import { LocalFile } from '../core/data_access_layer'
import { logger } from '../logger'
import bodyParser from 'body-parser'
import path from 'path'

mongoose.plugin(require('meanie-mongoose-to-json')); //change _id to id
const router = Router();
const dal = new LocalFile();
const userColl = mongoose.model('users', userModel);
const activityColl = mongoose.model('activities', activityModel);
const sortOption = { new: true, sort: { _id: -1 } };

router.get('/userprofile', bodyParser.json(), function (req, res) {
    res.render('index')
});
router.post('/submit', bodyParser.json(), (req, res) => {
    dal.find({ userId: req.body.userId }, userColl)
        .then((docs) => {
            if (docs[0] != undefined) {
                logger.info(`/submit found user's info -> userid: ${req.body.userId}`)
                dal.update(userColl, { userId: docs[0].userId }, req.body, sortOption)
                    .then((docs) => {
                        logger.debug("update update user profile", docs)
                        res.status(200).send(docs)
                    })
                    .catch((err) => {
                        logger.error("cannot update user profile :", err)
                        res.status(500).send(err.message)
                    })
            } else {
                logger.info(`/submit not found user's info -> userid: ${req.body.userId}`)
                var saveUser = new userColl(req.body);
                dal.save(saveUser)
                    .then((docs) => {
                        logger.debug("save user profile", docs)
                        res.status(200).send(docs)
                    })
                    .catch((err) => {
                        logger.error("can not save user profile", err)
                        res.status(500).send(err.message)
                    })
            }
        })
        .catch((err) => {
            logger.error("find userprofile unsuccessful", err)
            res.status(500).send(err.message)
        })
});
router.post('/gethistory', bodyParser.json(), function (req, res) {
    var getuserid = req.body;
    dal.find(getuserid, activityColl)
        .then((docs) => {
            logger.info(`/gethistory found user's activity -> userid: ${req.body.userId}`)
            let users = '<thead><tr><th>Profile pic</th><th>Name</th><th>Clock in</th><th>Clock out</th><th>Location</th><th>Plan</th></tr></thead><tbody>';
            if (docs[0] != undefined) {

                docs.forEach(doc => {
                    users += '<tr><td><img src="' + doc.url + '"></td><td>' + doc.displayName + '</td><td>' + doc.clockin + '</td><td>' + doc.clockout + '</td><td>' + doc.location.locationName + '</td><td>' + doc.plan + '</td></tbody>'
                });
                res.status(200).send(users)

            } else {
                logger.info(`/gethistory found user's activity -> userid: ${req.body.userId}`)
                users += '<tr><td colspan="6">' + 'no record !' + '</td></tr></tbody>'
                res.status(201).send(users)
            }

        })
        .catch((err) => {
            logger.error("find activityies unsuccessful", err)
            res.status(500).send(err.message)
        })
});

module.exports = router