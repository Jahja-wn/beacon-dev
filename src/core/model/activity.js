const timeZone = require('mongoose-timezone');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const activitySchema = new Schema({
    userId: String,
    displayName: String,
    type: String,
    timestamp: Date,
    subDocument: {
        subDate: {
            type: Date
        }
    },
    location: Object,
    askstate: Boolean,
    plan: String,
    url: String
})
activitySchema.plugin(require('meanie-mongoose-to-json'));//change _id to id
activitySchema.plugin(timeZone, { paths: ['timestamp', 'subDocument.subDate'] });
const activityModel = mongoose.model('activities',activitySchema)
module.exports = activityModel