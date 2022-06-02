const mongoose = require('mongoose');
const app = require('./app');
const {crearAdminInicio} = require('./src/controllers/usuario.controller');

mongoose.Promise = global.Promise;

mongoose.Promise = global.Promise;                                                                  
mongoose.connect('mongodb+srv://admin:admin123@api-rest.h9udywp.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
	console.log('Conectado a la base de datos.');

	app.listen(3000, function () {
		console.log('Corriendo en el puerto 3000!');		
		crearAdminInicio();
	});

}).catch(error => console.log(error));
