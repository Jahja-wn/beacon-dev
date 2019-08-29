(function () { 'use strict'; }());
import config from '../config';
import { logger } from '../../logger';
const moment = require('moment')
const today = moment().startOf('day')

async function handleBeaconEvent(userId, displayName, timestamp, hwid, url, userSchema, locationSchema, activitySchema) {

  let user = await this.dal.find({ userId: userId }, userSchema); //Find userid ,it is a member of the group or not.
  if (user[0] === undefined || user[0] === null) { logger.error(`Unrecognized user id: ${userId}`); return; }

  var findhwid = { hardwareId: hwid };
  var location = await this.dal.find(findhwid, locationSchema);
  if (location[0] === undefined || location[0] === null) { logger.error(`Unrecognized hardware id: ${hwid}`); return; }

  var activities = {
    userId: userId,
    timestamp: {
      $gte: today.toDate(),
      $lte: moment(today).endOf('day').toDate()
    }
  }
  var matchedActities = await this.dal.find(activities, activitySchema, { '_id': 'desc' }, 1); // Find activity matches userId and location for today  
  if (matchedActities[0] === undefined || matchedActities[0] === null) {
    logger.debug(`handleBeaconEvent not found matched activity -> userid: ${userId}, location: ${location[0].locationName}`);

    var saveActivity = new activitySchema({
      userId: userId,
      displayName: displayName,
      type: "in",
      timestamp: timestamp,
      location: new locationSchema({
        hardwareID: hwid,
        locationName: location[0].locationName,
        point: location[0].point
      }),
      askstate: false,
      plan: "none",
      url: url
    });

    this.dal.save(saveActivity)
      .then(async (docs) => {
        logger.info('save successful', docs);
        const call_asktodayplan = await this.conversationService.askTodayPlan(userId, location[0].locationName, activitySchema, user[0]) //call ask_today_plan ()
        logger.info('handleBeaconEvent', call_asktodayplan)
      })
      .catch((err) => {
        logger.error('save unsuccessful', err);
        return err;
      })
  }
  else {
    logger.debug(`handleBeaconEvent found matched activity -> userid: ${userId}, location: ${location[0].locationName}`);
    for (var i in matchedActities) {
      if (matchedActities[i].plan != 'none' && matchedActities[i].askstate == true) { // users become active again
        return this.messageService.sendMessage(config.ReportGroupId, displayName + ' re-enter ' + location[0].locationName);

      }
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
