const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
	inventory_id: mongoose.Schema.Types.ObjectId,
	inventory_name: {
		type: String,
		required: true
	},
	contact_person: {
		type: String,
		required: true
	},
	phone_number: {
		type: String,
		required: true
	},
	Address: {
		type: String,
		required: true
	},
	GST_Number: {
		type: String,
		required: true
	},
	DL_Number: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	city: {
		type: String,
		deafult: '-'
	},
	state: {
		type: String,
		deafult: '-'
	},
	created_at: {
		type: Date,
		default: Date.now()
	},
	last_logged_in: {
		type: Date,
		default: Date.now()
	},
	medi_code: {
		type: String,
		deafult: '-'
	}
});

module.exports = mongoose.model('inventories', inventorySchema);
