const express = require('express');

const router = express.Router();

const AreasController = require('../controllers/areas');

router.get('/', AreasController.area_get_all);

router.post('/new', AreasController.create_area);

router.get('/:areaId', AreasController.area_get_by_id);

router.post('/update/:areaId', AreasController.area_update_by_id);

router.post('/delete/:areaName', AreasController.area_delete_by_id);

module.exports = router;