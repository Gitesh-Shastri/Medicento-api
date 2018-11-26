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
	offer: {
		type: String
	},
	stock_left: {
		type: Number,
		required: true
	},
	discount: {
		type: Number
	},
	cost_for_medicento: {
		type: Number
	},
	manufacturing_date: {
		type: Date
	},
	expiry_date: {
		type: Date
	},
	price_to_seller: {
		type: Number
	},
	price_to_retailer: {
		type: Number
	},
	tax_price_to_retailer: {
		type: Number
	},
	tax_percentage: {
		type: Number
	},
	scheme: {
		type: String
	},
	percentage_scheme: {
		type: Number
		},
	batch_number: {
		type: String
	}
});

module.exports = mongoose.model('Inventory_product', inventoryProductSchema);