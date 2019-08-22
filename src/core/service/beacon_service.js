(function () { 'use strict'; }());
import config from '../config';
import { logger } from '../../logger';
async function handleBeaconEvent(userId, displayName, timestamp, hwid, url, userSchema, locationSchema, activitySchema) {

  var finduserId = { userId: userId };
  var sort = { '_id': 'desc' };
  var limit = 1;
  let user = await this.dal.find(finduserId, userSchema, sort, limit); //Find userid ,it is a member of the group or not.
  console.log(user)
  if (user[0] === undefined || user[0] === null) { logger.error(`Unrecognized user id: ${userId}`); return; }

  var findhwid = { hardwareId: hwid };
  var location = await this.dal.find(findhwid, locationSchema, sort, limit);
  if (location[0] === undefined || location[0] === null) { logger.error(`Unrecognized hardware id: ${hwid}`); return; }
  var matchedActities = await this.dal.find(finduserId, activitySchema, sort, limit); // Find activity matches userId and location for today  
  if (matchedActities[0] === undefined || matchedActities[0] === null) {
    logger.debug(`handleBeaconEvent not found matched activity -> userid: ${userId}, location: ${location[0].locationName}`);

    var saveActivity = new activitySchema({
      userId: userId,
      displayName: displayName,
      type: "in",
      timestamp: timestamp,
      location: new locationSchema({
        hardwareID: hwid,
        locationName: location[0].locationName
      }),
      askstate: "none",
      plan: "none",
      url: url
    });
    
    this.dal.save(saveActivity)
      .then((docs) => { logger.info('save successful', docs);})
      .catch((err) => { logger.error('save unsuccessful', err)})

     return this.conversationService.askTodayPlan(userId, location[0].locationName); //call ask_today_plan ()
  }



  // var user = this.dal.find(new User(userId), null, true); //Find out if the user is a member of the group or not.
  // if (user.length != 0) {
  //   let location = this.dal.find(new Location(hwid))[0];
  //   if(location === undefined){logger.error(`Unrecognized hardware id: ${hwid}`);return;}

  //   var findActivity = new Activity(userId, null, null, null, location , null, null,null);  
  //   var matchedActities = this.dal.find(findActivity, null, true);// Find all activity match userId and location for today

  //   if (matchedActities.length == 0) {  
  //     //case first time for today of user at location
  //     logger.debug(`handleBeaconEvent not found matched activity -> userid: ${userId}, location: ${location.locationName}`);
  //     this.dal.save(new Activity(userId, displayName, 'in', timestamp, location, 'none', 'none', url));
  //     return this.conversationService.askTodayPlan(userId, location); //call ask_today_plan ()

  //   } else {
  //     logger.debug(`handleBeaconEvent found matched activity -> userid: ${userId}, location: ${location.locationName}`);
  //     for (var i in matchedActities) {
  //       if (matchedActities[i].plan != 'none'  && matchedActities[i].askstate == true) { // users become active again
  //       return  this.messageService.sendMessage(config.ReportGroupId, displayName + ' re-enter '+location.locationName);

  //       }
  //     }
  //   }
  // }
}

function getDisplayName(userId, displayName, timestamp, hwid, url, model) {

  var finddisplayName = { userId: userId };
  var sort = { '_id': 'desc' };
  var limit = 1;
  let a = this.dal.find(finddisplayName, model, sort, limit);
}

class BeaconService {
  constructor(conversationService, messageService, dal) {
    this.conversationService = conversationService;
    this.handleBeaconEvent = handleBeaconEvent;
    this.getDisplayName = getDisplayName;
    this.messageService = messageService;
    this.dal = dal;
  }
}
export {
  BeaconService
};
