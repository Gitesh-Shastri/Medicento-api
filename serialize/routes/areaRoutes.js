const mongoose = require('mongoose');
const express= require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const AreasController = require('../controllers/areas');

router.get('/', AreasController.area_get_all);
router.post('/new', AreasController.orders_create_area);
    router.get('/:areaId', function(req, res) {
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
    });
    router.post('/update/:areaId', function(req, res) {
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
    });
router.post('/delete/:areaName', function (req, res) {
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
});
module.exports = router;
