import { Router } from 'express'
import mongoose from 'mongoose'
import { userModel, activityModel, locationModel } from '../core/model';
import { LocalFile } from '../core/data_access_layer';

const path = require('path');
const router = Router();
const dal = new LocalFile();
const userColl = mongoose.model('users', userModel);
const activityColl = mongoose.model('activities', activityModel);

router.get('/userprofile', function (req, res) {
    res.render('index')
});
router.post('/submit', (req, res) => {
    var saveUser = new userColl(req.body);
    dal.save(saveUser);
});
router.post('/gethistory', function (req, res) {
    var getuserid = req.body;
    console.log(getuserid)
    dal.find(getuserid, activityColl)
        .then((docs) => {
            let users = '<tr><th>name</th><th>type</th><th>date/time</th><th>location</th><th>plan</th></tr>';
            docs.forEach(doc => {
                users += '<tr><td>' + doc.displayName + '</td><td>' + doc.type + '</td><td>' + doc.timestamp + '</td><td>' + doc.location.locationName + '</td><td>' + doc.plan + '</td>'
            });
            // users += ''
            res.status(200).send(users)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(err.message)
        })
    //res.render('history')
});

module.exports = router