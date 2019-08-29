const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({
    hardwareID : String,
    locationName : String,
    point : Object
})
const locationModel = mongoose.model('locations',locationSchema)

module.exports = locationModel