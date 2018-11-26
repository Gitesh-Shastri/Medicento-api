const mongoose = require('mongoose');

const inventoryProductSchema = mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    inventory_product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory_product',
        required: true
    }
});

module.exports = mongoose.model('ProductAndMedi', inventoryProductSchema);