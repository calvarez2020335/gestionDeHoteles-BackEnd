const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GastoSchema = Schema({
	Servicios:  { type: Schema.Types.ObjectId, ref: 'Servicios' },
	Usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('Gastos', GastoSchema);