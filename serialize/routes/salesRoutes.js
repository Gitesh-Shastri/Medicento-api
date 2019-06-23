const express = require('express');

const router = express.Router();

const App_version = require('../models/app_versions');
const Pharmacy = require('../models/pharmacy');

router.post('/update_app_version', (req, res, next) => {
	App_version.findOne({ name: 'SalesApp' })
		.exec()
		.then((app_version) => {
			app_version.version_name = req.body.app_version;
			app_version.save();
			res.status(200).json({ message: 'updated app version', app_version: app_version });
		})
		.catch((err) => {
			res.status(200).json({ message: 'error occured' });
		});
});

router.get('/app_version', (req, res, next) => {
	App_version.findOne({ name: 'SalesApp' })
		.exec()
		.then((app_version) => {
			res.status(200).json({ message: 'Sales App Version', app_version: app_version });
		})
		.catch((err) => {
			res.status(200).json({ message: 'error occured' });
		});
});

router.get('/get_pharmacy', (req, res, next) => {
	Pharmacy.find()
		.exec()
		.then((pharmas) => {
			res.status(200).json({
				message: 'Pharmacies Found',
				pharmas: pharmas
			});
		})
		.catch((err) => {
			res.status(200).json({
				message: 'error occured'
			});
		});
});

module.exports = router;
