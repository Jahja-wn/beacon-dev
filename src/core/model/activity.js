
const mongoose = require('mongoose');
const timeZone = require('mongoose-timezone');
const Schema = mongoose.Schema;
const activitySchema = new Schema({
    userId: String,
    displayName: String,
    type: String,
    timestamp: Date,
    subDocument: {
        subDate: {
            type: Date,
        },
    },
    location: Object,
    askstate: Boolean,
    plan: String,
    url: String
})
activitySchema.plugin(timeZone, { paths: ['date', 'subDocument.subDate'] });

module.exports = activitySchema