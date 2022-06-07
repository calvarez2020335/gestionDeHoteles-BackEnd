const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservacionSchema = Schema({
	NombreReservacion: String,
	FechaEntrada: Timestamp,
	FechaSalida: Timestamp,
	habitacion:  { type: Schema.Types.ObjectId, ref: 'Habitaciones' },
	usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
});

module.exports = mongoose.model('Reservaciones', ReservacionSchema);