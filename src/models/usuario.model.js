const mongoose = require('mongoose');
require('dotenv').config();
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    
	nombre: String,
	email: String,
	imgUrl: String,
	password: String,
	rol: String
    
});

UsuarioSchema.methods.setImgUrl = function setImgUrl(filename) {
	this.imgUrl = `${process.env.APP_HOST}:${process.env.APP_PORT}/public/${filename}`;
};

module.exports = mongoose.model('Usuarios', UsuarioSchema);