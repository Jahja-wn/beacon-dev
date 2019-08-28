
const moment = require('moment-timezone');
const dateThailand = moment.tz(Date.now(), "Asia/Bangkok");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const activitySchema = new Schema({
    userId: String,
    displayName: String,
    type: String,
    timestamp: {type: Date, default: dateThailand},
    location: Object,
    askstate: Boolean,
    plan: String,
    url: String
})

module.exports = activitySchema