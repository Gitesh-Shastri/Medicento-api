const mongoose = require('mongoose');

const campSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    content: {
        type: String
    }
});

module.exports = mongoose.model('Camp', campSchema);