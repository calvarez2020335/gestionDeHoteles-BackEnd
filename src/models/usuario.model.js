const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    
	nombre: String,
	email: String,
	imgUrl: String,
	password: String,
	rol: String
    
});

UsuarioSchema.methods.setImgUrl = function setImgUrl(filename) {
	this.imgUrl = `localhost:3000/public/${filename}`;
};

module.exports = mongoose.model('Usuarios', UsuarioSchema);