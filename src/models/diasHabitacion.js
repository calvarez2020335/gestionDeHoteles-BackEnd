const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiasHabitacionSchema = Schema({

	dias: Number,
	PrecioHabitacion:Number,
	Total:Number,//dias x habitacion
	numHabitacion: Number,
	habitacion:  { type: Schema.Types.ObjectId, ref: 'Habitaciones' },
	Usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('DiasHabitaciones', DiasHabitacionSchema);