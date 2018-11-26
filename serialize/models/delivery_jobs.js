const mongoose = require('mongoose');

const deliveryJobsSchema = mongoose.Schema({
	delivery_person : {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'DeliveryPerson',
		required: true
    },
    pending_jobs: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
        	ref: 'Jobs'
    	}
    ],
    completed_jobs: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
        	ref: 'Jobs'
    	}
    ],
});

module.exports = mongoose.model('DeliveryJobs', deliveryJobsSchema);