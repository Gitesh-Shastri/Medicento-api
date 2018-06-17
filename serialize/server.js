const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models');
const areaRoutes = require('./routes/areaRoutes.js');
const pharmaRoutes = require('./routes/pharmaRoutes.js');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: "application/vnd.api+json"}));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		);
	if(req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

areaRoutes(app, db);
pharmaRoutes(app, db);

app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status(404);
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
        console.log(`listening on PORT ${PORT}`);
	});    
});

