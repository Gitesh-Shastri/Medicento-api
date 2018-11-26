const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    useremail: {
        type: String
    },
    password: {
        type: String
    },
    usercode: {
        type: String
    },
    phone: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);