const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelSchema = Schema({
	Nombre: String,
	Descripcion: String,
	Dirección: String,
	imgUrlHoltel: String,
	Dueno: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
});

module.exports = mongoose.model('Hoteles', HotelSchema);