const mongoose = require('mongoose');

const Invoicechema = mongoose.Schema({
    created_at: {
        type: Date,
        Default: Date.now()
    },
    invoice_id: {
        ype: mongoose.Schema.Types.ObjectId,
		ref: 'Invoice'
    },
    payment_mode: {
        type: String
    },
    total_amount: {
        type: Number
    },
    amount_due: {
        type: Number,
        Default: 0
    },
    amount_paid : {
        type: Number
    }
});

module.exports = mongoose.model('Invoice', Invoicechema);