const mongoose = require('mongoose');
const Pharmacy = require('../models/pharmacy');

module.exports = function (app) {

    //Fetch All The Pharmacy
    app.get('/pharma', function (req, res) {
        Pharmacy.find()
            .select('pharma_name pharma_address area')
            .populate('area', 'area_name area_city area_state area_pincode')
                .exec()
                .then(docs => {
                const response = {
                    count: docs.length,
                    areas: docs.map(doc => {
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
    app.post('/pharma/new', function (req, res) {
        const pharma = new Pharmacy({
            _id: mongoose.Types.ObjectId(),
            pharma_name: req.body.pharma_name,
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
    app.get('/pharmaByArea/:area_id', function (req, res) {
        const id = req.params.area_id;
        Pharmacy.find({ area: id })
            .select('pharma_name pharma_address area')
            .populate('area', 'area_name area_city area_state area_pincode')
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

    // Find Pharmacy By Name
    app.get('/pharma/:id', function (req, res) {
        const id = req.params.id;
        Pharmacy.findById(id)
            .select('pharma_name pharma_address area')
            .populate('area', 'area_name area_city area_state area_pincode')
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

    // Update Pharmacy By Name
    app.post('/pharma/update/:pharmaId', function (req, res) {
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
    app.delete('/pharma/delete/:pharmaId', function (req, res) {
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
}