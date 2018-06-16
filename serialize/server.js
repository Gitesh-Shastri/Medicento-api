const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models');
const areaRoutes = require('./routes/areaRoutes.js');
const pharmaRoutes = require('./routes/pharmaRoutes.js');

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: "application/vnd.api+json"}));

//static directory
app.use(express.static("app/public"));

areaRoutes(app, db);
pharmaRoutes(app, db);
app.use('/', (req, res, next) => {
	res.send('Helow');
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
        console.log(`listening on PORT ${PORT}`);
	});    
});

