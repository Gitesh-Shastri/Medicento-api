const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
	pharma_name: {
		type:String,
		required: true
    },
    dist_name: {
		type:String,
		required: true
    },
    dist_order: {
		type:Number,
		required: true
    },
    area_name: {
    	type:String,	
    },
    sales: {
    	type:String
    },
    dist_return: {
		type:Number,
		required: true
    },
    dist_delivery: {
		type:Number,
		required: true
    },
    dist_payment: {
		type:Number,
		required: true
    },
    dist_bounce: {
		type:Number,
		required: true
    },
    dist_behaviour: {
		type:Number,
		required: true
		},
		created_at: {
			type: Date,
			default: Date.now()
		}
});

module.exports = mongoose.model('Review', reviewSchema);
