const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();
const {crearAdminInicio} = require('./src/controllers/usuario.controller');

mongoose.Promise = global.Promise;

//mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@api-rest.h9udywp.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority

mongoose.connect('mongodb://localhost:27017/Hoteles', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
	console.log('Conectado a la base de datos.');

	app.listen(process.env.PORT || 3000, function () {
		console.log('Corriendo en el puerto 3000!');		
		crearAdminInicio();
	});

}).catch(error => console.log(error));
