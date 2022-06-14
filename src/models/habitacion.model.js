const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HabitacionSchema = Schema({
	numHabitacion: Number,
	imgUrlHabitacion: String,
	tipoHabitacion:String,
	Precio:Number,
	hotel: { type: Schema.Types.ObjectId, ref: 'Hoteles' },
	usuario: {type: Schema.Types.ObjectId, ref: 'Usuarios'}
});

HabitacionSchema.methods.setImgUrl = function setImgUrl(filename) {
	this.imgUrl = `${process.env.APP_HOST}:${process.env.APP_PORT}/public/${filename}`;
};

module.exports = mongoose.model('Habitaciones', HabitacionSchema);