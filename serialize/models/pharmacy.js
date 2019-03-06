const mongoose = require('mongoose');

const pharmaSchema = mongoose.Schema({
	pharma_id: mongoose.Schema.Types.ObjectId,
	area: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Area'
	},
	pharma_name: {
		type: String,
		default: "-"
	},
	pharma_address: {
		type: String,
		default: "-"
	},
	gst_license: {
		type: String,
		default: "-"
	},
	drug_license: {
		type: String,
		default: "-"
	},
	email: {
		type: String,
		default: "-"
	},
	contact: {
		type: String,
		default: "-"
	},
	owner_name: {
		type: String,
		default: "-"
	},
	pincode: {
		type: String,
		default: "-"	
	},
	pan_card: {
		type: String,
		default: "-"	
	},
	distributor: {
		type: String,
		default: "-"
	},
	distributor_Code: {
		type: String,
		default: "-"
	}
});

module.exports = mongoose.model('Pharmacy', pharmaSchema);
