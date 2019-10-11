import { Router } from 'express'
import mongoose from 'mongoose'
import { userModel, activityModel, locationModel } from '../core/model'
import { LocalFile } from '../core/data_access_layer'
import { logger } from '../logger'
import bodyParser from 'body-parser'
import path from 'path'
import moment from 'moment'

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

router.get('/history', bodyParser.json(), (req, res) => res.render('fakehistory'))

router.post('/gethistory', bodyParser.json(), function (req, res) {
    var getuserid = req.body;
    logger.debug(getuserid)
    res.send({redirect: 'http://localhost:3001/liff/history/'+getuserid.userId})
});

router.get('/history/:id', bodyParser.json(), (req, res) => {
    var getuserid = {userId: req.params.id};
    logger.debug(getuserid)
    dal.find(getuserid, activityColl)
    .then((docs) => {
        logger.debug(docs)
        res.render('history',{docs:docs});
    })
    .catch((err) => {
        logger.error("find activityies unsuccessful", err)
        res.status(500).send(err.message)
    })
})

router.get('/', bodyParser.json(), (req, res) => {
    var filter = {
        userId: "1",
        clockin: {
            $gte: moment().startOf('day'),
            $lte: moment().endOf('day')
        }
    }
    dal.find(filter, activityColl)
        .then((docs) => {
            logger.debug(docs)
            res.status(200).send(docs)
        })
        .catch((err) => {
            logger.error(err)
            res.status(500).send(err.message)
        })
})

router.post('/', bodyParser.json(), (req, res) => {

    logger.info(`POST /activity`)
    logger.info(`req : ${JSON.stringify(req.body)}`)
    const newactivity = new activityColl(req.body)
    dal.save(newactivity)
        .then((docs) => {
            logger.debug(docs)
            res.status(200).send(docs)
        })
        .catch((err) => {
            logger.error(err)
            res.status(500).send(err.message)
        })
})

module.exports = router