const mongoose = require('mongoose');

const jobsSchema = mongoose.Schema({
	pickup_point_lat: {
		type: Number,
		required: true
	},
	pickup_point_long: {
		type: Number,
		required: true
	},
	pickup_point_name: {
		type: String,
		required: true
	},
	slot: {
		type: Number,
		required: true
	},
	distance: {
		type: Number,
		required: true
	},
	pickup_point_address: {
		type: String,
		required: true
	},
	pick_up_for: {
		type: String,
		required: true
	},
	pick_up_type: {
		type: String,
		required: true
	},
	job_status: {
		type: String,
		required: true
	},
	pickup_point_instruction: {
		type: String,
		required: true
	},
	pickup_point_contact: {
		type: String,
		required: true
	},
	delivery_point_lat: {
		type: Number,
		required: true
	},
	delivery_point_long: {
		type: Number,
		required: true
	},
	delivery_point_name: {
		type: String,
		required: true
	},
	delivery_point_address: {
		type: String,
		required: true
	},
	delivery_point_instruction: {
		type: String,
		required: true
	},
	delivery_point_contact: {
		type: String,
		required: true
	},
	order: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'SalesOrder',
			required: true
	}
});

module.exports = mongoose.model('Jobs', jobsSchema);
