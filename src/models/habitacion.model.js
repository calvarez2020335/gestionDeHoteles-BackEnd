const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HabitacionSchema = Schema({
	numHabitacion: Number,
	imgUrlHabitacion: String,
	tipoHabitacion:String,
	Precio:Number,
	hotel: { type: Schema.Types.ObjectId, ref: 'Hoteles' }
});

module.exports = mongoose.model('Habitaciones', HabitacionSchema);