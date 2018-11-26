const mongoose = require('mongoose');

const Area = require('../models/area');

exports.area_get_all = function (req, res) {
    Area.find()
        .select('area_city area_state area_pincode area_name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                areas: docs.map(doc => {
                    return {
                        area_name: doc.area_name,
                        area_city: doc.area_city,
                        area_state: doc.area_state,
                        area_pincode: doc.area_pincode,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'https://medicento-api.herokuapp.com/area/' + doc._id
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

exports.create_area = function(req, res) {
    const area = new Area({
        area_id: new mongoose.Types.ObjectId(),
        area_name: req.body.area_name,
        area_city: req.body.area_city,
        area_state: req.body.area_state,
        area_pincode: req.body.area_pincode
    });
    area.save().then(result => {
        console.log(result);
        res.status(200).json({
            message: "Created Area Successfully !",
            area: {
                area_name: result.area_name,
                area_city: result.area_city,
                area_state: result.area_state,
                area_pincode: result.area_pincode,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'https://medicento-api.herokurouter.com/area/' + result._id
                }
            }
        });
    })
        .catch(err => {
            console.log(err);
        });
}

exports.area_get_by_id = function(req, res) {
    const id = req.params.areaId;
    Area.findById(id)
        .select('area_city area_state area_pincode area_name')
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

exports.area_update_by_id = function(req, res) {
    const id = req.params.areaId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
        }
        Area.update({_id: id}, { $set: updateOps})
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }

exports.area_delete_by_id = function (req, res) {
    const area_name = req.params.areaName;
    Area.findOneAndRemove({area_name: area_name})
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
