const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	useremail: {
		type: String
	},
	password: {
		type: String
	},
	username: {
		type: String
	},
	last_login: {
		type: Date,
		Default: Date.now()
	},
	created_at: {
		type: Date,
		Default: Date.now()
	},
	phone: {
		type: String
	},
	type: {
		type: String
	}
});

module.exports = mongoose.model('Admin', userSchema);
