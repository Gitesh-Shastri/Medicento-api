const mongoose = require('mongoose');

const pharmaSchema = mongoose.Schema({
	pharma_id: mongoose.Schema.Types.ObjectId,
	area: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Area',
		default: '5c4b5e7bed743008af76ef0e'
	},
	pharma_name: {
		type: String,
		default: '-'
	},
	pharma_address: {
		type: String,
		default: '-'
	},
	gst_license: {
		type: String,
		default: '-'
	},
	drug_license: {
		type: String,
		default: '-'
	},
	email: {
		type: String,
		default: '-'
	},
	contact: {
		type: String,
		default: '-'
	},
	owner_name: {
		type: String,
		default: '-'
	},
	pincode: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now()
	},
	pan_card: {
		type: String,
		default: '-'
	},
	distributor: {
		type: String,
		default: '-'
	},
	distributor_Code: {
		type: String,
		default: '-'
	},
	credits: {
		type: Number,
		default: 400000
	}
});

module.exports = mongoose.model('Pharmacy', pharmaSchema);
