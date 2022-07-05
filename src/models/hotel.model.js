const mongoose = require('mongoose');
require('dotenv').config();
const Schema = mongoose.Schema;

const HotelSchema = Schema({
	Nombre: String,
	Descripcion: String,
	Direccion: String,
	VecesSolicitado: Number,
	imgUrlHoltel: String,
	adminHotel: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
});

HotelSchema.methods.setImgUrl = function setImgUrl(filename) {
	this.imgUrlHoltel = `${process.env.APP_HOST}:${process.env.APP_PORT}/public/${filename}`;
};

module.exports = mongoose.model('Hoteles', HotelSchema);