const express = require('express');

const router = express.Router();

const Admin = require('../models/admin');

const State = require('../models/medicento_state');
const City = require('../models/medicento_city');
const Tulsi = require('../models/tulsimedicines');
const Inventory = require('../models/Inventory');
const vpi = require('../models/vpimedicine');

const SalesOrder = require('../models/SalesOrder');

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

router.get('/get_all_master_medicines', (req, res, next) => {
	tulsimedicines
		.find({})
		.limit(10)
		.exec()
		.then((response) => {
			console.log(response);
			res.status(200).json({ medicines: response });
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured' });
		});
});

router.post('/get_medicines_for_key', (req, res, next) => {
	term = req.body.term;
	vpi
		.find({ Item_name: new RegExp('' + term + '', 'i'), distributor: req.body.name })
		.limit(10)
		.skip(10 * req.body.pagno)
		.sort({ Item_name: 1 })
		.exec()
		.then((response) => {
			Tulsi.find({ Item_name: new RegExp('' + term + '', 'i') })
				.limit(10)
				.skip(10 * req.body.pagno)
				.sort({ Item_name: 1 })
				.exec()
				.then((inventory_master) => {
					res.status(200).json({ medicines: response, inventory_master: inventory_master });
				})
				.catch((err) => {
					res.status(200).json({ message: 'Error Occured' });
				});
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

router.post('/get_medicines_of_master', (req, res, next) => {
	var term = '';
	term = req.body.term;
	Tulsi.find({ Item_name: new RegExp('' + term + '', 'i') })
		.limit(10)
		.skip(10 * req.body.pagno)
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

router.post('/get_medicines_of_distributor', (req, res, next) => {
	var term = '';
	term = req.body.term;
	vpi
		.find({ Item_name: new RegExp('' + term + '', 'i'), distributor: req.body.name })
		.limit(10)
		.skip(10 * req.body.pagno)
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

router.post('/updateMedicines', (req, res, next) => {
	vpi
		.findOne({ item_code: req.body.mapped_id, distributor: req.body.name })
		.exec()
		.then((count) => {
			count.unmapped = 'Mapped';
			tulsimedicines
				.findOne({ _id: req.body.master })
				.exec()
				.then((medi) => {
					let id = {
						item_id: req.body.mapped_id,
						distributor: req.body.name
					};
					medi.mapped.push(id);
					medi.save();
					count.save();
					res.status(200).json({ medicines: medi });
				})
				.catch((err) => {
					res.status(200).json({ message: 'Error Occured from master' });
				});
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured from inventory' });
		});
});

router.post('/addMedicines/', (req, res, next) => {
	tulsimedicines
		.find({ Item_name: req.body.name })
		.exec()
		.then((doc) => {
			if (doc.length > 0) {
				res.status(200).json({ message: 'Already Exists', medicines: doc[0] });
			} else {
				let tulsipharma1 = new tulsimedicines();
				tulsipharma1.Item_name = req.body.name;
				tulsipharma1.item_code = '-';
				tulsipharma1.manfc_name = 'Medi';
				tulsipharma1.packing = '';
				tulsipharma1.qty = 0;
				tulsipharma1.mrp = 0;
				tulsipharma1.ptr = 0;
				tulsipharma1.scheme = '';
				tulsipharma1.save();
				res.status(200).json({ message: 'Created New Medicine ', medicines: tulsipharma1 });
			}
		})
		.catch((err) => {
			res.status(200).json({ message: 'Error Occured' });
		});
});

router.get('/get_orders', (Req, res, next) => {
	SalesOrder.find({})
		.sort({ created_at: -1 })
		.limit(10)
		.exec()
		.then((doc) => {
			res.status(200).json({ orders: doc });
		})
		.catch((err) => {
			res.status(200).json({ error: err });
		});
});

module.exports = router;
