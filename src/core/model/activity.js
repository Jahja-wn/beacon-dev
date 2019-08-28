const mongoose = require('mongoose');
const timeZone = require('mongoose-timezone');
 
const Schema = new mongoose.Schema({
    date: Date,
    subDocument: {
        subDate: {
            type: Date,
        },
    },
});
 
// If no path is given, all date fields will be applied
Schema.plugin(timeZone, { paths: ['date', 'subDocument.subDate'] });
module.exports = Schema