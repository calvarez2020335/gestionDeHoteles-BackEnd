const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    
	nombre: String,
	email: String,
	imgUrl: String,
	password: String,
	rol: String
    
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);