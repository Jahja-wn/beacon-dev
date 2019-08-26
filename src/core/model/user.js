const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userId: String,
    displayName: String,
    firstName: String,
    lastName: String,
    nickName: String
})

module.exports = userSchema