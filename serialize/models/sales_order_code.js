const mongoose = require('mongoose');

const orderCodeSchema = mongoose.Schema({
    code: {
        type: Number
    }
});

module.exports = mongoose.model('OrderCode', orderCodeSchema);