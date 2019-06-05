const express = require('express');

const router = express.Router();

const Admin = require('../models/admin');

const State = require('../models/medicento_state');
const City = require('../models/medicento_city');
const Tulsi = require('../models/tulsimedicines');
const Inventory = require('../models/Inventory');
const vpi = require('../models/vpimedicine');

const tulsimedicines = require('../models/tulsimedicines');

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

router.post('/upload_csv', (req, res, next) => {
	res.status(200).json('OK');
});

router.get('/getDistributorbyCity', (req, res, next) => {
	Inventory.find()
		.exec()
		.then((distributors) => {
			res.status(200).json({ message: 'Distributors Found', distributors: distributors });
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured' });
		});
});

router.get('/get_medicines_of_distributor/:name', (req, res, next) => {
	var term = '';
	term = req.params.name;
	vpi
		.find({ Item_name: new RegExp('' + term + '', 'i'), distributor: req.query.name })
		.limit(10)
		.skip(10 * req.query.pagno)
		.sort({ Item_name: 1 })
		.exec()
		.then((response) => {
			console.log(response);
			res.status(200).json({ medicines: response });
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured' });
		});
});

router.get('/total_unmapped/:name', (req, res, next) => {
	vpi.find({ distributor: req.params.name, unmapped: 'NotMapped' }).count().exec().then((count) => {
		res.status(200).json({ count: count });
	});
});

router.get('/get_unmapped/:unmapped/:name', (req, res, next) => {
	vpi
		.find({ unmapped: req.params.unmapped, distributor: req.params.name })
		.limit(10)
		.skip(10 * req.query.pagno)
		.exec()
		.then((count) => {
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

router.get('/addMedicines/:name', (req, res, next) => {
	let tulsipharma1 = new tulsimedicines();
	tulsipharma1.Item_name = req.params.name;
	tulsipharma1.item_code = '-';
	tulsipharma1.manfc_name = 'Medi';
	tulsipharma1.packing = '';
	tulsipharma1.qty = 0;
	tulsipharma1.mrp = 0;
	tulsipharma1.ptr = 0;
	tulsipharma1.scheme = '';
	tulsipharma1.save();
	res.status(200).json(tulsipharma1);
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
