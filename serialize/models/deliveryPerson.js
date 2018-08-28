const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema({
	user_email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	is_first_time_sign_in: {
		type: Boolean,
		default: true
	},
	user_name: {
		type: String
	},
	full_name: {
		type: String
	},
	phone_no: {
		type: String
	},
	date_of_birth: {
		type: Date
	},
	total_deliveries: {
		type: Number
	},
	avg_delivery_time: {
		type: String
	},
	collected_amount: {
		type: Number,
		default: 0
	},
	points: {
		type: Number,
		default: 0
	},
	delivery_completed: {
		type: Number,
		default: 0
	},
	delivery_pending: {
		type: Number,
		default: 0
	},
	area_and_delivery: [
		{
			type: mongoose.Schema.Types.ObjectId,
        	ref: 'areaanddelivery'
		}
	]
});

module.exports = mongoose.model('DeliveryPerson', deliverySchema);