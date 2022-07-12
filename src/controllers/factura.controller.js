const Factura = require('../models/factura.model');
const Usuario = require('../models/usuario.model');
const DiasHabitacion = require('../models/diasHabitacion.model');
const Habitacion = require('../models/habitacion.model');
const Hotel = require('../models/hotel.model');
const UsuariosSubcrito = require('../models/usuariosSubcritos.model');
const GastosServicios = require('../models/gastosServicios.model');
const Reservacion = require('../models/reservacion.model');
const Historial = require('../models/historial.modelo');
const PdfkitConstruct = require('pdfkit-construct');


function confirmarFactura (req , res) {
	var idFactura = req.params.idFactu;

	Factura.findOne( {_id: idFactura}, (err, facturaEncotrada) =>{
		if (err) return res.status(500).send({ mensaje: 'error en la peticion de buscar factura' });
		if (!facturaEncotrada) return res.status(500).send({ mensaje: 'Error en buscar factura' });

		if(facturaEncotrada.estado == 'Confirmado') return res.status(500).send({ mensaje: 'Esta factura ya fue confirmada'});

		Hotel.findOne({_id:facturaEncotrada.hotelHospedado, adminHotel: req.user.sub }, (err, adminHotelEncontrado) => {
			if (err) return res.status(500).send({ mensaje: 'error en la peticion de buscar adminHotel' });
			if(!adminHotelEncontrado) return res.status(500).send({ mensaje: 'Esta factura no pertenece a tu hotel' });
			GastosServicios.find({Usuario: facturaEncotrada.Usuario} , (err, gastoEncontrado) =>{
				if (err) return res.status(500).send({ mensaje: 'error en la peticion de buscar servicios solicitados' });
				if (!gastoEncontrado) return res.status(500).send({ mensaje: 'error al buscar servicios solicitaodos' });

				DiasHabitacion.findOne({Usuario: facturaEncotrada.Usuario}, (err, diasHabitacion)=>{

					if(err) return res.status(500).send({ mensaje: 'Error al buscar habitacion precio reserva'});
					if(!diasHabitacion) return res.status(500).send({ mensaje: 'Error al buscar habitacion precio reserva x2'});
					
					let totallocal = 0;
					let totalfactura = 0;
					let subTotalLocal = [];
			
					for (let i = 0; i < gastoEncontrado.length; i++) {

						subTotalLocal.push(gastoEncontrado[i].Precio);

						Factura.findOneAndUpdate ({_id: facturaEncotrada._id } , {$push: { servicios: { nombreServicios : gastoEncontrado[i].NombreSer , precio: gastoEncontrado[i].Precio}}} , {new: true} , (err, facturaActualzada) =>{
							if (err) return res.status(500).send({ mensaje: 'error en la peticion de gastos servicio factura' });
							if (!facturaActualzada) return res.status(500).send({ mensaje: 'error al calcular gastos servicio factura' });
						});
					}

					for (let i = 0; i < subTotalLocal.length; i++) {
						totallocal += subTotalLocal[i];
					}

					totalfactura = totallocal  + diasHabitacion.Total;
				

					Factura.findOneAndUpdate ({_id: facturaEncotrada._id } , { Subtotal : totallocal , total:  totalfactura, estado: 'Confirmado'}, {new: true} , (err, facturaActualzada) =>{
						if (err) return res.status(500).send({ mensaje: 'error en la peticion del eliminar el carrito' });
						if (!facturaActualzada) return res.status(500).send({ mensaje: 'error al eliminar el producto al carrito' });
		
						return	res.status(200).send({ mensaje: facturaActualzada});
					});
				});

			});

		} );

	});

}

function VerFactura(req, res) {

	const idHotel = req.params.idHotel;

	Hotel.findOne( { _id: idHotel , adminHotel: req.user.sub  } , (err, hotelEncontrado) => {
		if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar hotel admin'});
		if( !hotelEncontrado) return res.status(500).send({ mensaje: 'este hotel no te pertenese'});
	
		
		Factura.find({hotelHospedado : hotelEncontrado._id}, (err, VerFacturas) =>{
			if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar usuarios admin'});
			if( !VerFacturas) return res.status(500).send({ mensaje: 'Error la busacar id admin'});
	
			return	res.status(200).send({ VerFacturas:  VerFacturas});
	
		});
	});
}

function VerFacturaId (req, res){

	const idFactu = req.params.idFactura;

	Factura.find({_id : idFactu}, (err, VerFacturasId) =>{
		if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar factura admin'});
		if( !VerFacturasId) return res.status(500).send({ mensaje: 'Error la busacar id factura'});

		return	res.status(200).send({ VerFacturasID:  VerFacturasId});

	});


}

function pdf(req, res) {
	const idFactura = req.params.idFactura;
	var hoy = new Date();
	var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
	var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
	var fechaYHora = fecha + ' ' + hora;

	const HistorialModelo = new Historial();

	Factura.findOne( {_id: idFactura}, (err, facturaEncotrada) =>{
		if (err) return res.status(500).send({ mensaje: 'error en la peticion de buscar factura' });
		if (!facturaEncotrada) return res.status(500).send({ mensaje: 'error al buscar factura' });
	
		Hotel.findOne({_id : facturaEncotrada.hotelHospedado } , (err, HotelEncotrado) =>{
			if (err) return res.status(500).send({ mensaje: 'error en la peticion de buscar hotel' });
			if (!HotelEncotrado) return res.status(500).send({ mensaje: 'error al buscar hotel' }); 
	
			Usuario.findOne({_id: facturaEncotrada.Usuario} , (err, usuarioEncontrado) =>{
				if (err) return res.status(500).send({ mensaje: 'error en la peticion de buscar usuario' });
				if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'error al buscar usuario' }); 
					
				DiasHabitacion.find({Usuario: facturaEncotrada.Usuario}, (err, diasHabitacion)=>{
					if(err) return res.status(500).send({ mensaje: 'Error en la peticion de buscar habitacion precio reserva'});
					if(!diasHabitacion) return res.status(500).send({ mensaje: 'Error al buscar habitacion precio reserva'});

					DiasHabitacion.findOne({Usuario: facturaEncotrada.Usuario}, (err, diasHabitacion2)=>{
						if(err) return res.status(500).send({ mensaje: 'Error en la peticion de buscar habitacion precio reserva'});
						if(!diasHabitacion2) return res.status(500).send({ mensaje: 'Error al buscar habitacion precio reserva'});
					
						
						///////////////////////////////////////GENERAR PDF////////////////////////////////////////////////
						let count = 1;
						const registros = facturaEncotrada.servicios.map((prueba) => {
							const registro = {
	
								Num: count,
								nombre: prueba.nombreServicios,
								precio: 'Q' +  prueba.precio +'.00' ,
							};
							count++;
							return registro;
						});

						const habitaciones = diasHabitacion.map((prueba) => {
							const habitacion = {
							// NumHabitacion: prueba.numHabitacion,
								dias: prueba.dias,
								precio: 'Q' + prueba.PrecioHabitacion + '.00',
								Total: 'Q' + prueba.Total + '.00'
							};
							return habitacion;
						});

						// Create a document
						const doc = new PdfkitConstruct({
							size: 'A4',
							margins: {top: 20, left: 10, right: 10, bottom: 20},
							bufferPages: true,
						});

						// set the header to render in every page
						doc.setDocumentHeader({		
							height: '20%'
						}, () => {
							doc.lineJoin('miter')
								.rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill('#155B98');
							doc.fill('#ffff')
								.fontSize(20)
								.text( `Hotel: ${HotelEncotrado.Nombre}`, doc.header.x, doc.header.y);
							doc.fill('#ffff')
								.fontSize(15)
								.text(`Nombre: ${usuarioEncontrado.nombre}`, doc.header.x + 0 , doc.header.y + 40);	
							doc.fill('#ffff')
								.fontSize(15)
								.text(`Email usuario: ${usuarioEncontrado.email}`, doc.header.x + 0 , doc.header.y + 60);
						});

						doc.setDocumentFooter({
							height: '20%',
							marginLeft: 45,
							marginRight: 45,
						}, () => {
	
							doc.lineJoin('miter')
								.rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber).fill('#128AB0');
							doc.fill('#FFFFFF').fontSize(25).text(`Total: ${facturaEncotrada.total} Quetzales`, doc.footer.x + 110, doc.footer.y + 25, {
								align: 'right',
							});
							doc.fill('#FFFFFF').fontSize(15).text(`Emisión De Factura: ${fechaYHora}`, doc.footer.x, doc.footer.y + 131, {
								align: 'center',
							});
						});

						if(facturaEncotrada.servicios.length > 0){
							doc.addTable(
								[
									{key: 'Num', label: '#', align: 'center'},
									{key: 'nombre', label: 'Servicios Prestados', align: 'center'},
									{key: 'precio' , label: 'Precio', align: 'center'},
								],
								registros, {
									border: null,
									width: 'fill_body',
									striped: true,
									stripedColors: ['#f6f6f6', '#d6c4dd'],
									cellsPadding: 10,
									marginLeft: 45,
									marginRight: 45,
									headAlign: 'center'
								});
	
							doc.addTable(
								[
									{key: 'dias', label: 'Dias Hospedados', align: 'center'},
									{key: 'precio', label: 'Precio unitario', align: 'center'},
									{key: 'Total', label: 'Total', align: 'center'},
								],
								habitaciones, {
									border: null,
									width: 'fill_body',
									striped: true,
									stripedColors: ['#f6f6f6', '#d6c4dd'],
									cellsPadding: 10,
									marginLeft: 45,
									marginRight: 45,
									headAlign: 'center'
								});

							///////////////////////////////////////FIN GENERAR PDF////////////////////////////////////////////////

							///////////////////////////////////////Actualizar Habitaciones////////////////////////////////////////
							Habitacion.findOneAndUpdate({_id: diasHabitacion2.habitacion}, {$set:{ diponibilidad: 'true'}}, {new:true}, (err, habitacionActualizada)=>{
							});

							///////////////////////////////////////Insertar Historial////////////////////////////////////////////////

							HistorialModelo.usuario =  facturaEncotrada.Usuario;
							HistorialModelo.hotel = facturaEncotrada.hotelHospedado;
							HistorialModelo.NombreHotel = HotelEncotrado.Nombre;
							HistorialModelo.factura = idFactura;
							HistorialModelo.servicios = [] ;

							HistorialModelo.save((err, HistorialRegistrado)=>{
			
							});
						
							///////////////////////////////////////fin de Insertar Historial////////////////////////////////////////////////
			



							///////////////////////////////////////Fin Actualizar Habitaciones////////////////////////////////////

							///////////////////////////////////////Eliminar datos innecesarios////////////////////////////////////////
							GastosServicios.deleteMany({Usuario: usuarioEncontrado._id}, (err, gastosServicios)=>{
							
							});

							Reservacion.findOneAndDelete({usuario: usuarioEncontrado._id}, (err, reservacionDelete)=>{
							
							});

							DiasHabitacion.findOneAndDelete({Usuario: usuarioEncontrado._id}, (err, diasDelete)=>{
							
							});

							Factura.findByIdAndDelete(idFactura, (err, facturaEliminada)=>{
							

								///////////////////////////////////////actualizar Historial////////////////////////////////////////////////
								for (let i = 0; i < facturaEliminada.servicios.length; i++) {
	
									Historial.findOneAndUpdate ({factura: idFactura } , 
										{$push: { servicios: { nombreServicios : facturaEliminada.servicios[i].nombreServicios}}} 
										, {new: true} , (err, HistrorialActualizado) =>{

										
										});
								}
							///////////////////////////////////////fin actualizar Historial////////////////////////////////////////////////
							});

							///////////////////////////////////////Fin Eliminar datos innecesarios////////////////////////////////////

							// render tables
							doc.render();
							doc.pipe(res);
							doc.end();

						}else{

							doc.addTable(
								[
									{key: 'dias', label: 'Dias Hospedados', align: 'center'},
									{key: 'precio', label: 'Precio unitario', align: 'center'},
									{key: 'Total', label: 'Total', align: 'center'},
								],
								habitaciones, {
									border: null,
									width: 'fill_body',
									striped: true,
									stripedColors: ['#f6f6f6', '#d6c4dd'],
									cellsPadding: 10,
									marginLeft: 45,
									marginRight: 45,
									headAlign: 'center'
								});
							///////////////////////////////////////FIN GENERAR PDF////////////////////////////////////////////////

							///////////////////////////////////////Actualizar Habitaciones////////////////////////////////////////
							Habitacion.findOneAndUpdate({_id: diasHabitacion2.habitacion}, {$set:{ diponibilidad: 'true'}}, {new:true}, (err, habitacionActualizada)=>{
							});

							///////////////////////////////////////Insertar Historial////////////////////////////////////////////////

							HistorialModelo.usuario =  facturaEncotrada.Usuario;
							HistorialModelo.hotel = facturaEncotrada.hotelHospedado;
							HistorialModelo.NombreHotel = HotelEncotrado.Nombre;
							HistorialModelo.factura = idFactura;
							HistorialModelo.servicios = [] ;

							HistorialModelo.save((err, HistorialRegistrado)=>{
			
							});
						
							///////////////////////////////////////fin de Insertar Historial////////////////////////////////////////////////
			



							///////////////////////////////////////Fin Actualizar Habitaciones////////////////////////////////////

							///////////////////////////////////////Eliminar datos innecesarios////////////////////////////////////////
							GastosServicios.deleteMany({Usuario: usuarioEncontrado._id}, (err, gastosServicios)=>{
							
							});

							Reservacion.findOneAndDelete({usuario: usuarioEncontrado._id}, (err, reservacionDelete)=>{
							
							});

							DiasHabitacion.findOneAndDelete({Usuario: usuarioEncontrado._id}, (err, diasDelete)=>{
							
							});

							Historial.findOneAndUpdate({factura: idFactura }, {$push: { servicios: { nombreServicios : 'No se solicitaron servicios'}}}, {new: true} , (err, HistrorialActualizado) =>{
							});

							Factura.findByIdAndDelete(idFactura, (err, facturaEliminada)=>{
							
							});

							///////////////////////////////////////Fin Eliminar datos innecesarios////////////////////////////////////

							doc.render();
							doc.pipe(res);
							doc.end();
						}
						
					});	
				});
			});
		});
	});
	
}


module.exports = {
	confirmarFactura,
	pdf,
	VerFactura,
	VerFacturaId
};