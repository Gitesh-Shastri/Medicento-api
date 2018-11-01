const mongoose = require('mongoose');

const pharmaSchema = mongoose.Schema({
	pharma_id: mongoose.Schema.Types.ObjectId,
	area: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Area'
	},
	pharma_name: {
		type:String
	},
	pharma_address: {
		type: String
	}
});

module.exports = mongoose.model('Pharmacy', pharmaSchema);