const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServicioSchema = Schema({
	servicio: String,
	descripcion: String,
	Precio: Number,
	habitacion:  { type: Schema.Types.ObjectId, ref: 'Habitaciones' },
	Usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
});

module.exports = mongoose.model('Servicios', ServicioSchema);