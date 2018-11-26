const mongoose = require('mongoose');
const Pharmacy = require('../models/pharmacy');
const Message = require('../models/message');
const express= require('express');
const router = express.Router();
const Area = require('../models/area');

router.get('/area/area', (req, res, next) => {
        Area.find().exec().then( areas1 => {
            Pharmacy.find().exec().then( pharmas => {
                res.status(200).json({
                areas: areas1,
                pharmas: pharmas
            });
        }).catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }).catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
    });
    //Fetch All The Pharmacy
    router.get('', function (req, res) {
        Pharmacy.find()
            .select('pharma_name pharma_address area')
                .exec()
                .then(docs => {
                const response = {
                    count: docs.length,
                    pharmas: docs.map(doc => {
                        return {
                            pharma_name: doc.pharma_name,
                            pharma_address: doc.pharma_address,
                            _id: doc._id,
                            area_id: doc.area,
                            request: {
                                type: 'GET',
                                url: 'https://medicento-api.herokuapp.com/pharma/' + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });   
    });

    // Add A New Pharmacy
    router.post('/new', function (req, res) {
        const pharma = new Pharmacy({
            _id: mongoose.Types.ObjectId(),
            pharma_name: req.body[i].pharma_name,
            area: req.body.area_id,
            pharma_address: req.body.pharma_address
        });
        pharma.save()
              .then(result => {
                console.log(result);
                res.status(200).json(result);
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
              });
    });

    // Find Pharmacy By AreaID
    router.get('ByArea/:area_id', function (req, res) {
        const id = req.params.area_id;
        Pharmacy.find({ area: id })
            .select('pharma_name pharma_address area')
            .exec()
            .then(doc => {
                res.status(200).json(doc);
            })
            .catch(err => {
                console.log(err);
                res.status(404).json({
                    message: "No Valid Entry for provided ID"
                });
            });
    });

    
    router.get('/updateApp', (req, res) => {
        Message.find()
            .exec()
            .then( doc => {
                res.status(200).json({
                    code: doc[0].code,
                    count: doc[0].count,
                    "Version": [
                        {
                            "version": "2.0.8",
                            "error": "01"
                        }
                    ],
                    "Controle": [
                        {
                            "version": "2.0.8",
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
                            "version": "1.0",
                            "error": "01"
                        }
                    ],
                    "Controle": [
                        {
                            "version": "1.0",
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


    // Find Pharmacy By Name
    router.get('/:id', function (req, res) {
        const id = req.params.id;
        Pharmacy.find({_id: id})
            .select('pharma_name pharma_address area')
                .exec()
                .then(docs => {
                const response = {
                    count: docs.length,
                    pharmas: docs.map(doc => {
                        return {
                            pharma_name: doc.pharma_name,
                            pharma_address: doc.pharma_address,
                            _id: doc._id,
                            area_id: doc.area,
                            request: {
                                type: 'GET',
                                url: 'https://medicento-api.herokuapp.com/pharma/' + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });   
    });

    // Update Pharmacy By Name
    router.post('/update/:pharmaId', function (req, res) {
        const id = req.params.pharmaId;
        const updateOps = {};
        for (const ops of req.body) {
            updateOps[ops.propName] = ops.value;
        }
        Pharmacy.update({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    });

    // Delete Pharmacy By Name
    router.delete('/delete/:pharmaId', function (req, res) {
        const id = req.params.pharmaId;
        Pharmacy.findOneAndRemove({ _id: id })
            .exec()
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });

module.exports = router;
