const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();
const {crearAdminInicio} = require('./src/controllers/usuario.controller');

mongoose.Promise = global.Promise;

mongoose.Promise = global.Promise;                                                                  
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.BB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
	console.log('Conectado a la base de datos.');

	app.listen(process.env.PORT || 3000, function () {
		console.log('Corriendo en el puerto 3000!');		
		crearAdminInicio();
	});

}).catch(error => console.log(error));
