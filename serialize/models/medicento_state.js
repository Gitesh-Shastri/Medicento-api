const mongoose = require('mongoose');

const stateSchema = mongoose.Schema({
    name: {
        type: String,
        default: '-',
        unique: true
	}
});

module.exports = mongoose.model('Medicento_State', stateSchema);