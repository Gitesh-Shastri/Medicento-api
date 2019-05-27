const mongoose = require('mongoose');

const citySchema = mongoose.Schema({

    name: {
        type: String,
        default: '-'
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'Medicento_State'
    }

});

module.exports = mongoose.model('Medicento_City', citySchema);