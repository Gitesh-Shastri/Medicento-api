const express = require('express');

const router = express.Router();

const SalesOrder = require('../models/SalesOrder');
const SalesOrderItems = require('../models/SalesOrderItem');
const Area = require('../models/area');

const tulsimedicines = require('../models/tulsimedicines');
const Pharmacy = require('../models/pharmacy');
const Person = require('../models/sperson');

router.get('/', (req, res, next) => {
	SalesOrder.find({}).populate('SalesOrderItems').populate('Pharmacy').exec().then((orders) => {}).catch((err) => {
		res.status(200).json({ message: 'Error Occured' });
	});
});

module.exports = router;
