const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();
const {crearAdminInicio} = require('./src/controllers/usuario.controller');

mongoose.Promise = global.Promise;

//

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@api-rest.h9udywp.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{

	app.listen(process.env.PORT || 3000, function () {		
		crearAdminInicio();
	});

}).catch();
