const mongoose = require('mongoose');

const SalesOrderSchema = mongoose.Schema({
	sales_order_id: mongoose.Schema.Types.ObjectId,
	parent_order_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'SalesOrder'
	},
	pharmacy_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Pharmacy'
	},
	payment_id: {
		type: String,
		required: true
	},
	order_code: {
		type: String,
		required: true
	},
	payment_type: {
		type: String,
		required: true
	},
	delivery_person_id: {
		type: String,
		required: true
	},
	sales_person_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Person'
	},
	status: {
		type: String,
		required: true
	},
	invoice_id: {
		type: String,
		required: true
	},
	tax_amount: {
		type: String,
		required: true
	},
	grand_total: {
		type: String,
		required: true
	},
	timestamps: true,
	shipping_address_id: {
		type: String,
		required: true
	},
	billing_address: {
		type: String,
		required: true
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
	}
});

module.exports = mongoose.model('SalesOrder', SalesOrderSchema);