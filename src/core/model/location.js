const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({
    hardwareID : String,
    locationName : String,
    point : Object
})

locationSchema.plugin(require('meanie-mongoose-to-json'));//change _id to id
const locationModel = mongoose.model('locations',locationSchema)

module.exports = locationModel