const mongoose = require('mongoose');

const vpiMedicineSchema = mongoose.Schema({
    Item_name: {
        type: String,
        default: "-"
    },
    batch_no: {
        type: String,
        default: "-"
    },
    expiry_date: {
        type: String,
        default: "-"
    },
    qty: {
        type: Number,
        default: 0
    },
    packing: {
        type: String,
        default: "-"
    },
    item_code: {
        type: String,
        default: "-"
    },
    mrp: {
        type: Number,
        default: 0
    },
    manfc_code: {
        type: String,
        default: "-"
    },
    manfc_name: {
        type: String,
        default: "-"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VpiMedicine', vpiMedicineSchema);