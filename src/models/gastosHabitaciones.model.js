const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GastoHabitacionSchema = Schema({
	habitacion:  { type: Schema.Types.ObjectId, ref: 'Habitaciones' },
	Usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('GastosServicios', GastoHabitacionSchema);