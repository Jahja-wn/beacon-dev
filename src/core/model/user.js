const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userId: String,
    displayName: String,
    firstName: String,
    lastName: String,
    nickName: String
})
const userModel = mongoose.model('users', userSchema);
module.exports = userModel