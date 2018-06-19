const Area = require('../models/area');
const mongoose = require('mongoose');

module.exports = function(app) {
    app.get('/area', function (req, res) {
        res.status(200).json({
            message: "Handling get request to area"
        });
    });
    app.post('/area/new', function (req, res) {
        const area = new Area({
            area_id: new mongoose.Types.ObjectId(),
            area_name: req.body.area_name,
            area_city: req.body.area_city,
            area_state: req.body.area_state,
            area_pincode: req.body.area_pincode    
        });
        area.save().then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
        res.status(200).json({
            message: "Creating new area"
        });
    });
    app.get('/area/:areaId', function(req, res) {
        const id = req.params.areaId;
        Area.findById(id)
            .exec()
            .then(doc => {
                console.log(doc);
                res.status(200).json(doc);
            })
            .catch(err => {
                console.log(err);
                res.status(200).json({
                    error: err
                });
            });
    });
    app.post('/area/update/:id', function (req, res) {
        res.status(200).json({
            message: "Updating new area"
        });
    });
    app.delete('/area/delete/:id', function (req, res) {
        res.status(200).json({
            message: "Deleting area"
        });
    });
}