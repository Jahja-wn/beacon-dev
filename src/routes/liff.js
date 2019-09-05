import { Router } from 'express'
import mongoose from 'mongoose'
import { userModel, activityModel, locationModel } from '../core/model';
import { LocalFile } from '../core/data_access_layer';
import { logger } from '../logger';
const path = require('path');
const router = Router();
const dal = new LocalFile();
const userColl = mongoose.model('users', userModel);
const activityColl = mongoose.model('activities', activityModel);

router.get('/userprofile', function (req, res) {
    res.render('index')
});
router.post('/submit', (req, res) => {
    dal.find({ userId: req.body.userId }, userColl)
        .then((docs) => {
            logger.info("docs", docs)
            if (docs[0] != undefined) {
                dal.update(userColl, { userId: docs[0].userId }, req.body)
                    .catch((err) => {
                        logger.error("cannot update user profile :", err)
                    })
            } else {
                var saveUser = new userColl(req.body);
                dal.save(saveUser)
                    .catch((err) => {
                        logger.error("can not save user profile", err)
                    })
            }
        })
        .catch((err) => {
            logger.error("find userprofile unsuccessful", err)
        })
});
router.post('/gethistory', function (req, res) {
    var getuserid = req.body;
    dal.find(getuserid, activityColl)
        .then((docs) => {
            let users = ' <thead><tr><th>name</th><thead><th>type</th><th>date/time</th><th>location</th><th>plan</th></tr></thead><tbody>';
            docs.forEach(doc => {
                users += '<tr><td>' + doc.displayName + '</td><td>' + doc.type + '</td><td>' + doc.timestamp + '</td><td>' + doc.location.locationName + '</td><td>' + doc.plan + '</td></tbody>'
            });
            res.status(200).send(users)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(err.message)
        })
});

module.exports = router