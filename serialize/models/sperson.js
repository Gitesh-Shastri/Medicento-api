const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose);

const personSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Name: {
        type: String
    },
    Allocated_Area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area"
    },
    Allocated_Pharma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pharmacy"
    },
    commission: {
        type: Number,
        default: 0.22
    },
    Return_value: {
        type: Number,
        default: 0
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
