
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const activitySchema = new Schema({
    userId: String,
    displayName: String,
    type: String,
    timestamp: {type: Date, default: Date.now() + 60 * 60 * 1000},
    location: Object,
    askstate: Boolean,
    plan: String,
    url: String
})

module.exports = activitySchema