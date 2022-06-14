const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservacionSchema = Schema({
	NombreReservacion: String,
	FechaEntrada: Date,
	FechaSalida: Date,
	habitacion:  { type: Schema.Types.ObjectId, ref: 'Habitaciones' },
	usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
	hotel: { type: Schema.Types.ObjectId, ref: 'Hoteles' }
});

module.exports = mongoose.model('Reservaciones', ReservacionSchema);