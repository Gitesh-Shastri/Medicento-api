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
	}
});

module.exports = mongoose.model('Inventory', inventorySchema);