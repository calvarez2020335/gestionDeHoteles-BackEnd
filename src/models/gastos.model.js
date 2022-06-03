const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GastoSchema = Schema({
	numero: String,
	habitacion:  { type: Schema.Types.ObjectId, ref: 'Habitaciones' },
	Servicios:  { type: Schema.Types.ObjectId, ref: 'Servicios' },
	Usuarios: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('Gastos', GastoSchema);