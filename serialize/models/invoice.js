const mongoose = require('mongoose');

const InvoiceSchema = mongoose.Schema({
    created_at: {
        type: Date,
        Default: Date.now()
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'SalesOrder'
    },
    distributor_invoice_number: {
        type: String
    },
    distributor_order_id: {
        type: String
    },
    distributor_flag: {
        type: String
    }
});

module.exports = mongoose.model('Invoice', InvoicSechema);