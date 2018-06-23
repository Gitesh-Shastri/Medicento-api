const mongoose = require('mongoose');

const inventoryProductSchema = mongoose.Schema({
	inventory_product_id: mongoose.Schema.Types.ObjectId,
	inventory_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Inventory',
		required: true
	},
	product_name: {
		type: String,
		required: true
	},
	stock_left: {
		type: Number,
		required: true
	},
	discount: {
		type: Number,
		required: true
	},
	cost_for_medicento: {
		type: Number,
		required: true
	},
	manufacturing_date: {
		type: Date,
		required: true
	},
	expiry_date: {
		type: Date,
		required: true
	},
	price_to_seller: {
		type: Number,
		required: true
	},
	price_to_retailer: {
		type: Number,
		required: true
	},
	tax_price_to_retailer: {
		type: Number,
		required: true
	},
	tax_percentage: {
		type: Number,
		required: true
	},
	scheme: {
		type: String,
		required: true
	},
	percentage_scheme: {
		type: Number,
		required: true
	},
	batch_number: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Inventory_product', inventoryProductSchema);