const mongoose = require('mongoose');

const appVersionSchema = mongoose.Schema({
	created_at: {
		type: Date,
		Default: Date.now()
	},
	name: {
		type: String
	},
	version_name: {
		type: String
	}
});

module.exports = mongoose.model('app_version', appVersionSchema);
