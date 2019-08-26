
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const activitySchema = new Schema({
    userId: String,
    displayName: String,
    type: String,
    timestamp: Number,
    location: Object,
    askstate: Boolean,
    plan: String,
    url: String
})

module.exports = activitySchema