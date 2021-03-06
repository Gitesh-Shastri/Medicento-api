const Message = require('../models/message');

const express= require('express');

const router = express.Router();

const PharmaController = require('../controllers/pharma');

const Area = require('../models/area');

const Pharmacy = require('../models/pharmacy');

router.get('/area', (req, res, next) => {
	Area.find({ area_state: 'Karnataka', area_city: 'Bangalore' })
		.exec()
		.then((areas1) => {
			Pharmacy.find()
				.exec()
				.then((pharmas) => {
					res.status(200).json({
						areas: areas1,
						pharmas: pharmas
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err
					});
				});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

router.get('/area/area', PharmaController.pharam_and_area);

router.get('', PharmaController.get_all_pharmacy);

router.post('/new', PharmaController.create_new_pharmacy);

router.get('ByArea/:area_id', PharmaController.get_pharmacy_by_area_id);
   
router.get('/updateApp', (req, res) => {
        Message.find()
            .exec()
            .then( doc => {
                res.status(200).json({
                    code: doc[0].code,
                    count: doc[0].count,
                    "Version": [
                        {
                            "version": "2.1.1",
                            "error": "01"
                        }
                    ],
                    "Controle": [
                        {
                            "version": "2.1.1",
                            "error": "01"    
                        }
                    ]
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });
    
router.get('/updateSalesApp', (req, res) => {
        Message.find()
            .exec()
            .then( doc => {
                res.status(200).json({
                    code: doc[0].code,
                    count: doc[0].count,
                    "Version": [
                        {
                            "version": "1.0.1",
                            "error": "01"
                        }
                    ],
                    "Controle": [
                        {
                            "version": "1.0.1",
                            "error": "01"    
                        }
                    ]
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });

router.get('/updateAll', (req, res, next) => {
    Pharmacy.find()
    .exec()
    .then( doc => {
        res.status(200).json(doc);
    })
    .catch( err => {
        console.log(err);
        res.status(200).json(err);
    });
});

// Find Pharmacy By Name
router.get('/:id', PharmaController.get_pharmacy_by_id);

// Update Pharmacy By Name
router.post('/update/:pharmaId', PharmaController.update_pharmacy_by_id);

// Delete Pharmacy By Name
router.delete('/delete/:pharmaId', PharmaController.delete_pharmacy_by_id);

module.exports = router;
