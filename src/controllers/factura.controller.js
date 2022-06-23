const Factura = require('../models/factura.model');
const Usuario = require('../models/usuario.model');
const Servicio = require('../models/servicio.model');
const GastosServicios = require('../models/gastosServicios.model');

function confirmarFactura (req , res) {
	var idFactura = req.params.idFactu;
	var parametro = req.body;
	var facturaModelo = new Factura();
    

	// GastosServicios.find()

	Factura.findOneAndUpdate ({_id: idFactura } , {$pull: { servicios: { nombreServicios : null , precio: 0}}} , {new: true} , (err, facturaActualzada) =>{
		if (err) return res.status(500).send({ mensaje: 'error en la peticion del eliminar el carrito' });
		if (!facturaActualzada) return res.status(500).send({ mensaje: 'error al eliminar el producto al carrito' });

	});
    

}

module.exports = {
	confirmarFactura
};