module.exports = function (app) {

    //Fetch All The Pharmacy
    app.get('/pharma', function (req, res) {
        res.status(200).json({
            message: "Handling get request to pharma"
        });
    });

    // Add A New Pharmacy
    app.post('/pharma/new', function (req, res) {
        res.status(200).json({
            message: "Creating new  pharma"
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