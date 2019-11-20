(function () { 'use strict'; }());
import { logger } from '../../logger'
import moment from 'moment'

//handle when received beacon event
async function handleBeaconEvent(userId, displayName, timestamp, hwid, url, userSchema, locationSchema, activitySchema,token) {

  let user = await this.dal.find({ userId: userId }, userSchema, { '_id': 'desc' }, 1);                                                        // find the user is a group member or not. 
  if (user[0] === undefined) { logger.error(`Unrecognized user id: ${userId}`); return; }

  var location = await this.dal.find({ hardwareID: hwid }, locationSchema, { '_id': 'desc' }, 1);                                              // find user's location in db
  if (location[0] === undefined || location[0] === null) { logger.error(`Unrecognized hardware id: ${hwid}`); return; }


  var filter = {
    userId: userId,
    clockin: {
      $gte: moment().startOf('day'),
      $lte: moment().endOf('day')
    },
    'location.hardwareID': hwid,
  }
  var matchedActivities = await this.dal.find(filter, activitySchema, { '_id': 'desc' }, 0);                                   // Find match activities in each day by using userId and hwid 
  let matchedActivity = matchedActivities[0];
  if (matchedActivity === undefined) {                                                                                 // data does not exist
    logger.info(`handleBeaconEvent not found matched activity -> userid: ${userId}, location: ${location[0].locationName}`);
    var saveActivity = {
      userId: userId,
      displayName: displayName,
      type: "in",
      clockin: timestamp,
      clockout: null,
      location: {
        hardwareID: hwid,
        locationName: location[0].locationName,
        point: location[0].point
      },
      askstate: false,
      dialogs:false,
      plan: "none",
      url: url
    };

    try {
      const docs = await this.dal.save(new activitySchema(saveActivity))                                                    // insert data in database with activitySchema format 
      logger.debug('handleBeaconEvent save activity successful', docs);
      await this.conversationService.askTodayPlan(userId, location[0].locationName, activitySchema, user[0],token)                // call ask_today_plan ()
    }
    catch (err) {
      logger.error('handleBeaconEvent save activity unsuccessful', err);
      return err;
    }
  }
  else {
    logger.info(`handleBeaconEvent found matched activity -> userid: ${userId}, location: ${location[0].locationName}`);
    if (matchedActivity.plan != 'none' &&matchedActivity.type !="out" && matchedActivity.dialogs == false) {                                             // if users become active again, send confirm message to user
      await this.dal.update(activitySchema, { userId: matchedActivity.userId }, { dialogs: true }, { new: true, sort: { "_id": -1 } })
      return this.messageService.sendConfirmMessage(userId)
    }
  }
}

class BeaconService {
  constructor(conversationService, messageService, dal) {
    this.conversationService = conversationService;
    this.handleBeaconEvent = handleBeaconEvent;
    this.messageService = messageService;
    this.dal = dal;
  }
}
export {
  BeaconService
};
