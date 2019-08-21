const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userId: String,
    displayName: String,
    firstName: String,
    LastName: String,
    nickName: String
})
const users = mongoose.model("users", userSchema)

module.exports = users