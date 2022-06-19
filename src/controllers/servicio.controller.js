const Servicio = require('../models/servicio.model');
const Hotel = require('../models/hotel.model');

//Funcion para que el administrador del hotel pueda registrar servicios que ofrecen sus habitación en su hotel
function registrarServicio(req, res) {
	const parametro = req.body;
	const modeloServicio = new Servicio();
	const idHotel = req.params.idHotel;

	if(parametro.servicio && parametro.descripcion && parametro.Precio){

		
		Hotel.findOne({_id: idHotel, adminHotel: req.user.sub}, (err, hotelEncontrado) => {
			if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar hoteles-servicio'});
			if(!hotelEncontrado) return res.status(500).send({ mensaje: 'No puede registrar servicios a un hotel que no le pertenezca'});

			Servicio.findOne({servicio: {$regex: parametro.servicio ,$options:'i'}, hotel: idHotel}, (err, servicioEncontrado) => {
				if(err) return res.status(500).send({mensaje: 'Error en la petición de buscar el servicio'});
				if(servicioEncontrado) return res.status(500).send({ mensaje: 'El servicio ya a sido creado' });
                
				modeloServicio.servicio = parametro.servicio;
				modeloServicio.descripcion = parametro.descripcion;
				modeloServicio.Precio = parametro.Precio;
				modeloServicio.Usuario = req.user.sub;
				modeloServicio.hotel = idHotel;

				modeloServicio.save((err, servicioGuardado) => {
					if(err) return res.status(500).send({ mensaje: 'Error en la peticion al guardadr servicio' });
					if(!servicioGuardado) return res.status(500).send({ mensaje: 'Error al guardar el servicio'});

					return res.status(200).send({ servicioGuardado: servicioGuardado});
				});
               
			});
           
		});
	}else return res.status(500).send({mensaje:'Debe de eviar los parametros obligatorios'});

}

function verServicios(req, res) {
	const idHotel = req.params.idHotel;

	if(req.user.rol = 'ROL_ADMINHOTEL'){
		Servicio.find({hotel: idHotel, Usuario: req.user.sub}, (err, serviciosEncontrados)=>{
			if(err) return res.status(500).send({mensaje: 'Error en la peticion de buscar servicios'});
			if(!serviciosEncontrados) return res.status(500).send({mensaje: 'No puede ver los servicios de otro hotel'});
			return res.status(200).send({Servicios: serviciosEncontrados});
		});
	}if (req.user.rol = 'ROL_USUARIO') {
		Servicio.find({hotel: idHotel}, (err, serviciosEncontrados) => {
			if(err) return res.status(404).send({mensaje: 'Error en la peticion de buscar servicios'});
			if(!serviciosEncontrados) return res.status(404).send({mensaje: 'Error al ver los servicios del hotel'});
			return res.status(200).send({Servicios: serviciosEncontrados});
		});
	} else {
		return res.status(500).send({ mensaje: 'No tiene acceso a este recurso'});
	}

}

module.exports= {
	registrarServicio
};