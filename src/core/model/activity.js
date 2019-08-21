
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const activitySchema = new Schema({
    userId : String,
    displayName : String,
    type : String,
    timestamp : Number,
    location : String,
    askstate : String,
    plan : String,
    url : String
})
const activities = mongoose.model("activities", activitySchema)

module.exports = activities