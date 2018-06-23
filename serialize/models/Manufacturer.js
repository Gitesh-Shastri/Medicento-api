const mongoose = require('mongoose');

const manufacturerSchema = mongoose.Schema({
	manufacturer_id: mongoose.Schema.Types.ObjectId,
	manufacturer_name: {
		type: String,
		required: true
	},
	manufacturer_code: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Pharmacy', pharmaSchema);