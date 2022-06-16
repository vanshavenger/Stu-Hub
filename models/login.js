const mongoose = require('mongoose');
const passportLocalMoongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const loginSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    }

});
loginSchema.plugin(passportLocalMoongoose);

module.exports = mongoose.model('Login', loginSchema);