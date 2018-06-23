const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	product_id: mongoose.Schema.Types.ObjectId,
	medicento_name: {
		type: String,
		required: true
	},
	product_code: {
		type: String,
		required: true
    },
    company_name: {
        type: String,
        required: true
    },
	total_stock: {
		type: Number,
		required: true
	},
	contents: {
		type: String,
		required: true
	},
	package_type: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true 
	},
	category: {
		type: String,
		required: true
	},
	box_quantity: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('Product', productSchema);