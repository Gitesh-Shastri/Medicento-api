const mongoose = require('mongoose');

const areadeliverySchema = mongoose.Schema({
	area: {
		type: String,
		required: true
    },
    No_of_delivery: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('areaanddelivery', areadeliverySchema);