const express = require('express');

const router = express.Router();

const Admin = require('../models/admin');

const State = require('../models/medicento_state');
const City = require('../models/medicento_city');
const Tulsi = require('../models/tulsimedicines');
const Inventory = require('../models/Inventory');
const vpi = require('../models/vpimedicine');

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

router.get('/get_distributor_by_city', (req, res, next) => {});

router.post('/upload_csv', (req, res, next) => {
	res.status(200).json('OK');
});

router.get('/inventory', (req, res, next) => {
	var inventory = new Inventory();
	inventory.inventory_name = '';
	inventory.contact_person = '';
	inventory.phone_number = '';
	inventory.Address = '';
	inventory.GST_Number = '';
	inventory.DL_Number = '';
	inventory.email = '';
	inventory.city = '';
	inventory.state = '';
});

router.get('/get_medicines_of_distributor/:name', (req, res, next) => {
	var term = '';
	term = req.params.name;
	vpi
		.find({ Item_name: new RegExp('' + term + '', 'i') })
		.limit(10)
		.skip(10 * req.query.pagno)
		.sort({ Item_name: 1 })
		.exec()
		.then((response) => {
			res.status(200).json({ medicines: response });
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured' });
		});
});

router.get('/total_unmapped', (req, res, next) => {
	vpi.find({}).count().exec().then((count) => {
		res.status(200).json({ count: count });
	});
});

// router.get('/update', (req, res, next) => {
// 	vpi.find({}).exec().then((count) => {
// 		for (var i = 0; i < count.length; i++) {
// 			count[i].unmapped = 'NotMapped';
// 			count[i].save();
// 		}
// 	});
// });

router.get('/get_unmapped/:unmapped', (req, res, next) => {
	vpi.find({ unmapped: req.params.unmapped }).exec().then((count) => {
		res.status(200).json({ medicines: count });
	});
});

router.get('/updateMedicines', (req, res, next) => {
	vpi.findOne({ item_code: req.query.mapped_id }).exec().then((count) => {
		count.unmapped = 'Mapped';
		count.save();
		res.status(200).json({ medicines: count });
	});
});

router.get('/get_medicines_of_master/:name', (req, res, next) => {
	var term = '';
	term = req.params.name;
	Tulsi.find({ Item_name: new RegExp('' + term + '', 'i') })
		.limit(10)
		.skip(10 * req.query.pagno)
		.sort({ Item_name: 1 })
		.exec()
		.then((response) => {
			res.status(200).json({ medicines: response });
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured' });
		});
});

module.exports = router;
