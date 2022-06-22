
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuariosSubcritosSchema = Schema({
	hotel: { type: Schema.Types.ObjectId, ref: 'Hoteles' },
	usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
});

module.exports = mongoose.model('UsuariosSubcritos', UsuariosSubcritosSchema);