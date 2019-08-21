(function () {'use strict';}());
import { users } from '../model';
import { LocalFile } from '../data_access_layer/local_file';
import config from '../config';
import { logger } from '../../logger';

 function handleBeaconEvent(userId, displayName, timestamp, hwid, url) {
  console.log(userId)

  var finddisplayName = { userId: userId };
  var sort = { '_id': 'desc' };
  var limit = 1;
  this.dal.find(finddisplayName,users, sort, limit);

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

class BeaconService {
  constructor(conversationService,messageService,dal) {
    this.conversationService = conversationService;
    this.handleBeaconEvent = handleBeaconEvent;
    this.messageService = messageService;
    this.dal = dal;
  }
}
export {
  BeaconService
};
