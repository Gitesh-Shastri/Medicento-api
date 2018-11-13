const mongoose = require('mongoose');
const SalesOrderSchema = mongoose.Schema({
	sales_order_id: mongoose.Schema.Types.ObjectId,
	parent_order_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'SalesOrder'
	},
	sales_order_code: {
		type: String
	},
	sales_order_parent_code: {
		type: String
	},
	order_items: [
		{
			type: mongoose.Schema.Types.ObjectId,
        	ref: 'SalesOrderItems'
		}
	],
	pharmacy_id: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true
	},
	payment_id: {
		type: String
	},
	order_code: {
		type: String
	},
	payment_type: {
		type: String
	},
	delivery_person_id: {
		type: String
	},
	sales_person_id: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
        required: true
	},
	state: {
		type: String,
		default: "Accepted"
	},
	status: {
        type: String,
        required: true
	},
	invoice_id: {
		type: String
	},
	tax_amount: {
		type: String
	},
	grand_total: {
		type: String,
		required: true
    },
    created_at: {
        type: Date
    },
	shipping_address_id: {
		type: String
	},
	billing_address: {
		type: String
	},
	customer_session_id: {
		type: String
	},
	customer_ip: {
		type: String
	},
	voucher_discount: {
		type: Number
	},
	shipping_amount: {
		type: Number
	},
	google_analytics_track_id: {
		type: String
	},
	delivery_date: {
		type: Date,
		required: true
	}
});

module.exports = mongoose.model('SalesOrder', SalesOrderSchema);
