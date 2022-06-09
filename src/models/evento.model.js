const mongoose = require('mongoose');
require('dotenv').config();
const Schema = mongoose.Schema;

const EventoSchema = Schema({
	Nombre: String,
	tipoEvento:String,
	Descripcion: String,
	imgUrlEvento: String,
	hotel: { type: Schema.Types.ObjectId, ref: 'Hoteles' },
	adminHotel: { type: Schema.Types.ObjectId, ref: 'Usuarios'}
});

EventoSchema.methods.setImgUrl = function setImgUrl(filename) {
	this.imgUrlEvento = `${process.env.APP_HOST}:${process.env.APP_PORT}/public/${filename}`;
};

module.exports = mongoose.model('Eventos', EventoSchema);