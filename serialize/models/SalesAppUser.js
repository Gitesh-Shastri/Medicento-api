const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
	Name: {
		type: String,
		default: '-'
	},
	commission: {
		type: Number,
		default: 0.22
	},
	Return_value: {
		type: Number,
		default: 0
	},
	Total_sales: {
		type: Number,
		default: 0
	},
	No_of_order: {
		type: Number,
		default: 0
	},
	Returns: {
		type: Number,
		default: 0
	},
	Earnings: {
		type: Number,
		default: 0
	},
	useremail: {
		type: String,
		default: '-'
	},
	password: {
		type: String,
		default: '-'
	},
	usercode: {
		type: String,
		default: '-'
	},
	phone: {
		type: String,
		default: '-'
	},
	Allocated_Area: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Area'
	},
	Allocated_Pharma: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Pharmacy'
	}
});

module.exports = mongoose.model('SalesPerson', personSchema);
