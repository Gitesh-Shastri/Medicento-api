const mongoose = require('mongoose');

const areaSchema = mongoose.Schema({
	area_id: mongoose.Schema.Types.ObjectId,
	area_name: {
		type:String,
		required: true
	},
	area_city: {
		type:String,
		required: true
	},
	area_state: {
		type:String,
		required: true
	},
	area_pincode: {
		type:String,
		required: true
	}
});

module.exports = mongoose.model('Area', areaSchema);