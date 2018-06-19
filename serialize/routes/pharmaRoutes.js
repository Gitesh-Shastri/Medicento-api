const mongoose = require('mongoose');
const Pharmacy = require('../models/pharmacy');

module.exports = function (app) {

    //Fetch All The Pharmacy
    app.get('/pharma', function (req, res) {
        res.status(200).json({
            message: "Handling get request to pharma"
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
        res.status(200).json({
            message: "Searching pharma by area_id"
        });
    });

    // Find Pharmacy By Name
    app.get('/pharma/:pharmaName', function (req, res) {
        res.status(200).json({
            message: "Searching pharma by pharmaName"
        });
    });

    // Update Pharmacy By Name
    app.post('/pharma/update/:pharmaName', function (req, res) {
        res.status(200).json({
            message: "Updating pharma"
        });
    });

    // Delete Pharmacy By Name
    app.delete('/pharma/delete/:pharmaName', function (req, res) {
        res.status(200).json({
            message: "Deleting pharma"
        });
    });
}