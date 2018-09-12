const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	product_id: mongoose.Schema.Types.ObjectId,
	medicento_name: {
		type: String,
		required: true
	},
	product_code: {
		type: String
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
		type: String
	},
	package_type: {
		type: String
	},
	description: {
		type: String 
	},
	category: {
		type: String
	},
	box_quantity: {
		type: Number
	}
});

module.exports = mongoose.model('Product', productSchema);