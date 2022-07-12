const Servicio = require('../models/servicio.model');
const Hotel = require('../models/hotel.model');
const Reservacion = require('../models/reservacion.model');
const GastosServicios = require('../models/gastosServicios.model');
let date = new Date();

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

	if(req.user.rol === 'ROL_ADMINHOTEL'){
		Servicio.find({hotel: idHotel, Usuario: req.user.sub}, (err, serviciosEncontrados)=>{
			if(err) return res.status(500).send({mensaje: 'Error en la peticion de buscar servicios'});
			if(!serviciosEncontrados) return res.status(500).send({mensaje: 'No puede ver los servicios de otro hotel'});
			return res.status(200).send({Servicios: serviciosEncontrados});
		});
	}else if(req.user.rol === 'ROL_USUARIO') {
		Servicio.find({hotel: idHotel}, (err, serviciosEncontrados) => {
			if(err) return res.status(404).send({mensaje: 'Error en la peticion de buscar servicios'});
			if(!serviciosEncontrados) return res.status(404).send({mensaje: 'Error al ver los servicios del hotel'});
			return res.status(200).send({Servicios: serviciosEncontrados});
		});
	} else {
		return res.status(500).send({ mensaje: 'No tiene acceso a este recurso'});
	}

}

function verServiciosId(req, res) {
	const idServicio = req.params.idServicio;
	if(req.user.rol == 'ROL_ADMINHOTEL'){

		Servicio.findOne({_id: idServicio, Usuario: req.user.sub}, (err, serviciosEncontrados)=>{
			if(err) return res.status(500).send({mensaje: 'Error en la peticion de buscar servicios'});
			if(!serviciosEncontrados) return res.status(500).send({mensaje: 'No puede ver los servicios de otro hotel'});
			return res.status(200).send({Servicios: serviciosEncontrados});
		});

	}else if(req.user.rol == 'ROL_USUARIO') {
		Servicio.find({_id: idServicio}, (err, serviciosEncontrados) => {
			if(err) return res.status(404).send({mensaje: 'Error en la peticion de buscar servicios'});
			if(!serviciosEncontrados) return res.status(404).send({mensaje: 'Error al ver los servicios del hotel'});
			return res.status(200).send({Servicios: serviciosEncontrados});
		});
	} else {
		return res.status(500).send({ mensaje: 'No tiene acceso a este recurso'});
	}

}

//Solo AdminHotel
function editarServicio(req, res) {
	const idServicio = req.params.idServicio;
	const parametro = req.body;

	Servicio.findOneAndUpdate({_id: idServicio, Usuario: req.user.sub}, {$set:{servicio: parametro.servicio, descripcion: parametro.descripcion, Precio: parametro.Precio}}, {new: true}, (err, servicioActualizado)=>{
		if(err) return res.status(500).send({mensaje: 'Error en la peticion de editas servicios'});
		if(!servicioActualizado) return res.status(500).send({ mensaje: 'No puede editar eventos que no le pertenezcan'});
		return res.status(200).send({servicioActualizado: servicioActualizado});
	});

}

//Solo adminHotel
function eliminarServicio(req, res){
	const idServicio = req.params.idServicio;

	Servicio.findOneAndDelete({_id: idServicio, Usuario: req.user.sub}, (err, servicioEliminado)=>{
		if(err) return res.status(500).send({mensaje: 'Error en la peticion de eliminar eventos'});
		if(!servicioEliminado) return res.status(500).send({mensaje: 'No puede eliminar eventos que no le pertenezcan'});

		return res.status(200).send({servicioElimando: servicioEliminado});
	});
}

//Solo usuario solicitar servicio-habitacion
function servicioHabitacion(req, res) {
	const idUsuario = req.user.sub;
	const parametro = req.body;
	const gastosModel = new GastosServicios();

	Reservacion.findOne({usuario: idUsuario}, (err, reservacionEncontrada) => {
		if(err) return res.status(500).send({mensaje: 'Error en la petición en buscar la reservación'});
		if(!reservacionEncontrada) return res.status(404).send({mensaje: 'No ha hecho una reservación '});
		const fechaSalida = parseInt(reservacionEncontrada.FechaSalida);
		const hoy = parseInt(date.getDate());
		if(hoy > fechaSalida) return res.status(500).send({mensaje: 'La reservación ya a caducado'});
		Servicio.findOne({servicio: {$regex: parametro.servicio, $options:'i'}}, (err, servicioEncontrado)=>{
			if(err) return res.status(500).send({mensaje: 'Error en la peticion de buscar servicio'});
			if(!servicioEncontrado) return res.status(500).send({mensaje: 'Error al buscar servicios'});	
			gastosModel.Servicios = servicioEncontrado._id;
			gastosModel.Habitacion = reservacionEncontrada.habitacion;
			gastosModel.NombreSer = servicioEncontrado.servicio;
			gastosModel.Precio = servicioEncontrado.Precio;
			gastosModel.Usuario = idUsuario;	
			gastosModel.save((err, servicioPedido) => {
				if(err) return res.status(500).send({mensaje: 'Error en la petición de solicitar un servicio'});
				if(!servicioPedido) return res.status(200).send({mensaje: 'Error al solicitar el servicio'});
				return res.status(200).send({servicioSolicitado: servicioPedido}); 
			});
		});
	});
}


function verGastosServicios (req, res) {

	GastosServicios.find({Usuario: req.user.sub}, (err, GastosEncontrados) =>{
		if(err) return res.status(500).send({mensaje: 'Error en la petición de GastosEncontrados'});
		if(!GastosEncontrados) return res.status(200).send({mensaje: 'Error al GastosEncontrados'});

		return res.status(200).send({mensaje: GastosEncontrados}); 

	});

}

module.exports= {
	registrarServicio,
	verServicios,
	verServiciosId,
	editarServicio,
	eliminarServicio,
	servicioHabitacion,
	verGastosServicios
};