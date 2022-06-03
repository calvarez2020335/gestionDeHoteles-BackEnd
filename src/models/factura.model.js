const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacturaSchema = Schema({
	numero: String,
	gastos: { type: Schema.Types.ObjectId, ref: 'Gastos' },
	Subtotal:Number,
	total:Number,
	Usuarios: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

module.exports = mongoose.model('Facturas', FacturaSchema);