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
	}
});

module.exports = mongoose.model('DeliveryPerson', deliverySchema);