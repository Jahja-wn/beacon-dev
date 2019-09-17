(function () { 'use strict'; }());
import { logger } from '../../logger';
const moment = require('moment')
const today = moment().startOf('day')

async function handleBeaconEvent(userId, displayName, timestamp, hwid, url, userSchema, locationSchema, activitySchema) {
  let user = await this.dal.find({ userId: userId }, userSchema);
  if (user[0] === undefined) { logger.error(`Unrecognized user id: ${userId}`); return; }

  var location = await this.dal.find({hardwareId: hwid}, locationSchema);
  if (location[0] === undefined || location[0] === null) { logger.error(`Unrecognized hardware id: ${hwid}`); return; }

  var filter = {
    userId: userId,
    'location.hardwareID': hwid,
    timestamp: {
      $gte: today.toDate(),
      $lte: moment(today).endOf('day').toDate()
    }
  }

  var matchedActities = await this.dal.find(filter, activitySchema, { '_id': 'desc' }); // Find activity matches userId and location for today  
  console.log("activity",matchedActities)
  if (matchedActities[0] === undefined) {
    logger.info(`handleBeaconEvent not found matched activity -> userid: ${userId}, location: ${location[0].locationName}`);
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
        logger.debug('handleBeaconEvent save activity successful', docs);
        await this.conversationService.askTodayPlan(userId, location[0].locationName, activitySchema, user[0]) //call ask_today_plan ()
      })
      .catch((err) => {
        logger.error('handleBeaconEvent save activity unsuccessful', err);
        return err;
      })
  }
  else {
    logger.info(`handleBeaconEvent found matched activity -> userid: ${userId}, location: ${location[0].locationName}`);
    if (matchedActities[0].plan != 'none' && matchedActities[0].type != 'out') { // users become active again
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

    // if (matchedActities.plan != 'none') { // users become active again

    //   return this.messageService.sendConfirmMessage(userId)



    //    return this.messageService.sendMessage(config.ReportGroupId, displayName + ' re-enter ' + location[0].locationName);


    // for (var i in matchedActities) {
    //   if (matchedActities[i].plan != 'none' && matchedActities[i].askstate == true) { // users become active again
    //     return this.messageService.sendMessage(config.ReportGroupId, displayName + ' re-enter ' + location[0].locationName);

    //   }
    // }