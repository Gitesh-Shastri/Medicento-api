module.exports = function(app, db) {
	//CRUD
    app.get('/area', function (req, res) {
        db.Area.findAll({}).then(function (result) {
            res.status(200).json(result);
        });
    });
    app.post('/area/new', function (req, res) {
        db.Area.create({
            area_name: req.body.area_name,
            area_city: req.body.area_city,
            area_state: req.body.area_state,
            area_pincode: req.body.area_pincode
        }).then(function (result) {
            res.status(200).json(result);
        });
    });
    app.post('/area/update/:id', function (req, res) {
        db.Area.update({
            area_name: req.body.area_name,
            area_city: req.body.area_city,
            area_state: req.body.area_state,
            area_pincode: req.body.area_pincode
        }, {
            where: {
                id: req.params.id
            }
            }).then(function (result) {
                res.status(200).json(result);
        });
    });
    app.delete('/area/delete/:id', function (req, res) {
        db.Area.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (result) {
            res.json(result);
        });
    });
}