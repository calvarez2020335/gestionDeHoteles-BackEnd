
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuariosSubcritosSchema = Schema({
	hotel: { type: Schema.Types.ObjectId, ref: 'Hoteles' },
	NombreHotel: String,
	usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
	NombreUsuario: String
});

module.exports = mongoose.model('UsuariosSubcritos', UsuariosSubcritosSchema);