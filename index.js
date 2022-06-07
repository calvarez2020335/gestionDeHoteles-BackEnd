const mongoose = require('mongoose');
const app = require('./app');
const {crearAdminInicio} = require('./src/controllers/usuario.controller');
const URL = 'mongodb://localhost:27017/Hoteles';

mongoose.Promise = global.Promise;

mongoose.Promise = global.Promise;                                                                  
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
	console.log('Conectado a la base de datos.');

	app.listen(3000, function () {
		console.log('Corriendo en el puerto 3000!');		
		crearAdminInicio();
	});

}).catch(error => console.log(error));
