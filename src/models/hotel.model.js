const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelSchema = Schema({
	Nombre: String,
	Descripcion: String,
	imgUrlHoltel: String,
	Dueño: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
	usuarios: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
});

module.exports = mongoose.model('Hoteles', HotelSchema);