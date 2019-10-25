
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const activitySchema = new Schema({
    userId: String,
    displayName: String,
    type: String,
    clockin: Date,
    clockout: Date,
    location: Object,
    askstate: Boolean,
    dialogs:Boolean,
    plan: String,
    url: String
})
activitySchema.plugin(require('meanie-mongoose-to-json'));//change _id to id
const activityModel = mongoose.model('activities', activitySchema)
module.exports = activityModel