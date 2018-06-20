const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Total_sales: {
        type: Number,
        default: 0
    },
    No_of_order: {
        type: Number,
        default: 0
    },
    Returns: {
        type: Number,
        default: 0
    },
    Earnings: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Person', personSchema);