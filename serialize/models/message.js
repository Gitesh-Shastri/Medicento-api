const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    code: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Message', messageSchema);