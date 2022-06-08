const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventoSchema = Schema({
	Nombre: String,
	Descripcion: String,
	imgUrlEvento: String,
	hotel: { type: Schema.Types.ObjectId, ref: 'Hoteles' },
	adminHotel: { type: Schema.Types.ObjectId, ref: 'Usuarios'}
});

EventoSchema.methods.setImgUrl = function setImgUrl(filename) {
	this.imgUrl = `localhost:3000/public/${filename}`;
};

module.exports = mongoose.model('Eventos', EventoSchema);