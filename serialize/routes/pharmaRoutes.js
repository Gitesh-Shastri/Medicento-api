module.exports = function (app, db) {

    //Fetch All The Pharmacy
    app.get('/pharma', function (req, res) {
        db.Pharmacy.findAll({}).then(function (result) {
            res.status(200).json(result);
        });
    });

    // Add A New Pharmacy
    app.post('/pharma/new', function (req, res) {
        db.Pharmacy.create({
            pharma_name : req.body.pharma_name,
            pharma_paddress: req.body.pharma_paddress,
            pharma_saddress: req.body.pharma_saddress,
            pharma_mobile: req.body.pharma_mobile,
            pharma_tele: req.body.pharma_tele,
            pharma_email: req.body.pharma_email,
            pharma_gst: req.body.pharma_gst,
            pharma_license: req.body.pharma_license,
            pharma_contact_name: req.body.pharma_contact_name,
            pharma_contact_number: req.body.pharma_contact_number,
            AreaId : req.body.area_id
        }).then(function (result) {
            res.status(200).json(result);
        });
    });

    // Find Pharmacy By AreaID
    app.get('/pharmaByArea/:area_id', function (req, res) {
        db.Pharmacy.findAll({
            where: {
                AreaId: req.params.area_id
            }
        }).then(function (result) {
            res.status(200).json(result);
        });
    });

    // Find Pharmacy By Name
    app.get('/pharma/:pharmaName', function (req, res) {
        db.Pharmacy.findAll({
            where: {
                pharma_name: req.params.pharmaName
            }
        }).then(function (result) {
            res.status(200).json(result);
        });
    });

    // Update Pharmacy By Name
    app.post('/pharma/update/:pharmaName', function (req, res) {
        db.Pharmacy.update({
            pharma_name: req.body.pharma_name
        }, {
                where: {
                    pharma_name: req.params.pharmaName
                }
            }).then(function (result) {
                res.status(200).json(result);
        });
    });

    // Delete Pharmacy By Name
    app.delete('/pharma/delete/:pharmaName', function (req, res) {
        db.Pharmacy.destroy({
            where: {
                pharma_name: req.params.pharmaName
            }
        }).then(function (result) {
            res.json(result);
        });
    });
}