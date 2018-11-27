const mongoose = require('mongoose');

const Area = require('../models/area');

const Pharmacy = require('../models/pharmacy');

exports.pharam_and_area = function (req, res, next) {
    Area.find().exec().then(areas1 => {
        Pharmacy.find().exec().then(pharmas => {
            res.status(200).json({
                areas: areas1,
                pharmas: pharmas
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
}

exports.get_all_pharmacy = function (req, res) {
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
}

exports.create_new_pharmacy = function (req, res) {
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
}

exports.get_pharmacy_by_area_id = function (req, res) {
    const id = req.params.area_id;
    Pharmacy.find({
            area: id
        })
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
}

exports.get_pharmacy_by_id = function (req, res) {
    const id = req.params.id;
    Pharmacy.find({
            _id: id
        })
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
}

exports.update_pharmacy_by_id = function (req, res) {
    const id = req.params.pharmaId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Pharmacy.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

exports.delete_pharmacy_by_id = function (req, res) {
    const id = req.params.pharmaId;
    Pharmacy.findOneAndRemove({
            _id: id
        })
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
}