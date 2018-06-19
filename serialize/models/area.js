const mongoose = require('mongoose');

const areaSchema = mongoose.Schema({
	area_id: mongoose.Schema.Types.ObjectId,
	area_name: String,
	area_city: String,
	area_state: String,
	area_pincode: String
});

module.exports = mongoose.model('Area', areaSchema);