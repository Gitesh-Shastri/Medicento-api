const mongoose = require('mongoose');

const pharmaSchema = mongoose.Schema({
	pharma_id: mongoose.Schema.Types.ObjectId,
	area: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Area',
		required: true
	},
	pharma_name: {
		type:String,
		required: true
	},
	pharma_address: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Pharmacy', pharmaSchema);