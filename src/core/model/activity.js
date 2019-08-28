
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const activitySchema = new Schema({
    userId: String,
    displayName: String,
    type: String,
    timestamp: { type: Date, default: Date.now },
    location: Object,
    askstate: Boolean,
    plan: String,
    url: String
},{timestamps: true})

module.exports = activitySchema