const Factura = require('../models/factura.model');
const Usuario = require('../models/usuario.model');


function CreaFactura (req , res) {
	idUser = req.params.idUser;
	var parametro = req.body;
	var facturaModelo = new Factura();
    


}

module.exports = {
	CreaFactura
};