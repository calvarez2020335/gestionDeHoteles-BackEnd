const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GastoServiciosSchema = Schema({
	Servicios:  { type: Schema.Types.ObjectId, ref: 'Servicios' },
	Habitacion: { type: Schema.Types.ObjectId, ref: 'Habitaciones'},
	Precio: Number,
	Usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('GastosServicios', GastoServiciosSchema);