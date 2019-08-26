
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({
    hardwareID : String,
    locationName : String,
    point : Object
})

module.exports = locationSchema