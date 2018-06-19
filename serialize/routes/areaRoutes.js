module.exports = function(app) {
    app.get('/area', function (req, res) {
        res.status(200).json({
            message: "Handling get request to area"
        });
    });
    app.post('/area/new', function (req, res) {
        res.status(200).json({
            message: "Creating new area"
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