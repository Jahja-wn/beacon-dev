
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({
    hardwareID : String,
    locationName : String,
})

module.exports = locationSchema
// (function () {'use strict';}());
// export class Location{
// constructor(hardwareID, locationName, latLong) {
//         if(latLong !== null && latLong !== undefined && (!('lat' in latLong) || !('lon' in latLong))) throw "latlang need to contain [latitude] and [longitude]";
//         this.hardwareID = hardwareID;
//         this.locationName = locationName;    
//         this.point = latLong;
//     }
// }

