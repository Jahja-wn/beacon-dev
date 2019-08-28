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
},{_id: false, id: false, timestamps: true })

module.exports = activitySchema