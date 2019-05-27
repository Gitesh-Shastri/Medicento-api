const express = require('express');

const router = express.Router();

const Admin = require('../models/admin');

const State = require('../models/medicento_state');
const City = require('../models/medicento_city');

router.post('/login', (req, res, next) => {
	Admin.findOne({
		useremail: req.body.email,
		password: req.body.password
	})
		.select('useremail last_login type username phone')
		.exec()
		.then((admin) => {
			res.status(200).json({ message: 'User Found', user: admin });
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured' });
		});
});

router.get('/get_states', (req, res, next) => {
	State.find({})
		.sort({ name: 1 })
		.exec()
		.then((states) => {
			City.find({ state: states[0]._id })
				.exec()
				.then((cities) => {
					res.status(200).json({ message: 'States Found', states: states, cities: cities });
				})
				.catch((err) => {
					res.status(200).json({ message: 'Error Occured' });
				});
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured' });
		});
});

router.get('/get_city_by_state', (req, res, next) => {
	City.find({ state: req.query.state_id })
		.exec()
		.then((cities) => {
			res.status(200).json({ message: 'Cities Found', cities: cities });
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured' });
		});
});

module.exports = router;
