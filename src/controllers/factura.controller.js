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

		Hotel.findOne({_id:facturaEncotrada.hotelHospedado, adminHotel: req.user.sub }, (err, adminHotelEncontrado) => {
			if (err) return res.status(500).send({ mensaje: 'error en la peticion de buscar adminHotel' });
			if(!adminHotelEncontrado) return res.status(500).send({ mensaje: 'Esta factura no pertenece a tu hotel' });
			console.log(adminHotelEncontrado);

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
					console.log(totalfactura);
				

					Factura.findOneAndUpdate ({_id: facturaEncotrada._id } , { Subtotal : totallocal , total:  totalfactura}, {new: true} , (err, facturaActualzada) =>{
						if (err) return res.status(500).send({ mensaje: 'error en la peticion del eliminar el carrito' });
						if (!facturaActualzada) return res.status(500).send({ mensaje: 'error al eliminar el producto al carrito' });
		
						console.log(facturaActualzada);
					});
					console.log(totallocal);
					return	res.status(200).send({ gastoEncontrado:  gastoEncontrado});
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
	
		UsuariosSubcrito.findOne( {usuario: facturaEncotrada.Usuario}, (err, UsuariosSubcritoEncontrado) =>{
			if (err) return res.status(500).send({ mensaje: 'error en la peticion del buscarUsarioSubscrito' });
			if (!UsuariosSubcritoEncontrado) return res.status(500).send({ mensaje: 'error al buscarUsarioSubscrito' }); 
	
			Hotel.findOne({_id : UsuariosSubcritoEncontrado.hotel } , (err, HotelEncotrado) =>{
				if (err) return res.status(500).send({ mensaje: 'error en la peticion de buscar hotel' });
				if (!HotelEncotrado) return res.status(500).send({ mensaje: 'error al buscar hotel' }); 
	
				Usuario.findOne({_id: UsuariosSubcritoEncontrado.usuario} , (err, usuarioEncontrado) =>{
					if (err) return res.status(500).send({ mensaje: 'error en la peticion de buscar usuario' });
					if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'error al buscar usuario' }); 
					
					DiasHabitacion.find({Usuario: facturaEncotrada.Usuario}, (err, diasHabitacion)=>{
						if(err) return res.status(500).send({ mensaje: 'Error en la peticion de buscar habitacion precio reserva'});
						if(!diasHabitacion) return res.status(500).send({ mensaje: 'Error al buscar habitacion precio reserva'});
						
						///////////////////////////////////////GENERAR PDF////////////////////////////////////////////////
						let count = 1;
						const registros = facturaEncotrada.servicios.map((prueba) => {
							const registro = {
	
								Num: count,
								nombre: prueba.nombreServicios,
								precio: 'Q' +  prueba.precio +'.00' ,
							};
							count++;
							console.log(registro );
							return registro;
						});

						const habitaciones = diasHabitacion.map((prueba) => {
							const habitacion = {
								// NumHabitacion: prueba.numHabitacion,
								dias: prueba.dias,
								precio: 'Q' + prueba.PrecioHabitacion + '.00',
								Total: 'Q' + prueba.Total + '.00'
							};
							console.log(habitacion);
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
							doc.image('images/kumtatz_propuesta_3.3.jpeg', 495, 0, {fit: [80, 80]})
								.rect(495, 0, 80, 80)
								.stroke()
								.text('Fit', 495, 0);
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
						
						// render tables
						doc.render();
						doc.pipe(res);
						doc.end();
						///////////////////////////////////////FIN GENERAR PDF////////////////////////////////////////////////

						///////////////////////////////////////Actualizar Habitaciones////////////////////////////////////////
						Habitacion.findOneAndUpdate({Usuario: usuarioEncontrado._id}, {$set:{ diponibilidad: 'true'}}, {new:true}, (err, habitacionActualizada)=>{
							console.log(habitacionActualizada);
						});

						///////////////////////////////////////Insertar Historial////////////////////////////////////////////////

						HistorialModelo.usuario =  facturaEncotrada.Usuario;
						HistorialModelo.hotel = UsuariosSubcritoEncontrado.hotel;
						HistorialModelo.NombreHotel = HotelEncotrado.Nombre;
						HistorialModelo.servicios = [] ;

						HistorialModelo.save((err, HistorialRegistrado)=>{
							console.log(HistorialRegistrado);
						});
						
						///////////////////////////////////////fin de Insertar Historial////////////////////////////////////////////////
			



						///////////////////////////////////////Fin Actualizar Habitaciones////////////////////////////////////

						///////////////////////////////////////Eliminar datos innecesarios////////////////////////////////////////
						GastosServicios.deleteMany({Usuario: usuarioEncontrado._id}, (err, gastosServicios)=>{
							console.log(gastosServicios);
						});

						Reservacion.findOneAndDelete({usuario: usuarioEncontrado._id}, (err, reservacionDelete)=>{
							console.log(reservacionDelete);
						});

						DiasHabitacion.findOneAndDelete({Usuario: usuarioEncontrado._id}, (err, diasDelete)=>{
							console.log(diasDelete);
						});

						Factura.findByIdAndDelete(idFactura, (err, facturaEliminada)=>{
							console.log('factura eliminada' +  facturaEliminada);

							///////////////////////////////////////actualizar Historial////////////////////////////////////////////////
							for (let i = 0; i < facturaEliminada.servicios.length; i++) {
	
								Historial.findOneAndUpdate ({usuario: facturaEliminada.Usuario } , 
									{$push: { servicios: { nombreServicios : facturaEliminada.servicios[i].nombreServicios}}} 
									, {new: true} , (err, HistrorialActualizado) =>{

										console.log( 'historial' + HistrorialActualizado);
									});
							}
							///////////////////////////////////////fin actualizar Historial////////////////////////////////////////////////
						});
						


						///////////////////////////////////////Fin Eliminar datos innecesarios////////////////////////////////////
					});	
				});
			});
		});
	});

}

// const PDFDocument = require('pdfkit');
// const blobStream = require('blob-stream');

// function pdfPrueba (req, res){

// 	// require dependencies


// 	// create a document the same way as above
// 	const doc = new PDFDocument();

// 	// pipe the document to a blob
// 	const stream = doc.pipe(blobStream());

// 	// add your content to the document here, as usual

// 	// get a blob when you are done
// 	doc.end();
// 	stream.on('finish', function() {
// 		// get a blob you can do whatever you like with
// 		const blob = stream.toBlob('application/pdf');

// 		// or get a blob URL for display in the browser
// 		const url = stream.toBlobURL('application/pdf');
// 		iframe.src = url;
// 	});
// }


// function prueba (req, res){
// 	var filesLoaded = 0;

// 	var files = {
// 		img1: {
// 			url: 'https://pdfkit.org/docs/images/test.jpeg'
// 		},
// 		img2: {
// 			url: 'https://pbs.twimg.com/profile_images/519367942866104320/PB96rDH_.png'
// 		},
// 		img3: {
// 			url:
//       'https://img.freepik.com/free-icon/github-character-silhouette_318-40485.jpg?size=338&ext=jpg'
// 		}
// 	};

// 	var doc = new PDFDocument({
// 		layout: 'landscape',
// 		size: [311.83, 595.28],
// 		margins: {
// 			top: 0,
// 			bottom: 0,
// 			left: 0,
// 			right: 0
// 		}
// 	});
// 	var stream = doc.pipe(blobStream());

// 	function loadedFile(xhr) {
// 		for (var file in files) {
// 			if (files[file].url === xhr.responseURL) {
// 				files[file].data = xhr.response;
// 			}
// 		}
// 		filesLoaded += 1;
// 		if (filesLoaded == Object.keys(files).length) {
// 			showPDF();
// 		}
// 	}

// 	for (var file in files) {
// 		files[file].xhr = new XMLHttpRequest();
// 		files[file].xhr.onreadystatechange = function() {
// 			if (this.readyState == 4 && this.status == 200) {
// 				loadedFile(this);
// 			}
// 		};
// 		files[file].xhr.responseType = 'arraybuffer';
// 		files[file].xhr.open('GET', files[file].url);
// 		files[file].xhr.send(null);
// 	}

// 	function showPDF() {
// 		doc.rect(10, 10, 430, 20).fill('#000000');
// 		doc.rect(450, 10, 135, 20).fill('#000000');

// 		doc
// 			.moveTo(10, 180)
// 			.lineTo(430, 180)
// 			.stroke();
// 		doc
// 			.moveTo(10, 240)
// 			.lineTo(310, 240)
// 			.stroke();
// 		doc
// 			.moveTo(10, 280)
// 			.lineTo(310, 280)
// 			.stroke();
// 		doc
// 			.moveTo(445, 10)
// 			.lineTo(445, 300)
// 			.dash(5)
// 			.stroke();

// 		// pass loaded ArrayBuffer data instead of a path to image
// 		doc.image(files.img1.data, 455, 80, { fit: [80, 80] });
// 		doc.image(files.img2.data, 455, 200, { fit: [80, 80] });
// 		doc.image(files.img3.data, 350, 200, { fit: [80, 80] });

// 		doc.fontSize(17);
// 		doc.fillColor('white').text('TEST1', 12, 13);
// 		doc.fillColor('white').text('TEST2', 452, 13);

// 		doc.end();
// 	}

// 	const a = document.createElement('a');
// 	document.body.appendChild(a);
// 	a.style = 'display: none';

// 	let blob;

// 	function download() {
// 		if (!blob) return;
// 		var url = window.URL.createObjectURL(blob);
// 		a.href = url;
// 		a.download = 'test.pdf';
// 		a.click();
// 		window.URL.revokeObjectURL(url);
// 	}

// 	stream.on('finish', function() {
// 		// get a blob you can do whatever you like with
// 		blob = stream.toBlob('application/pdf');

// 		const url = stream.toBlobURL('application/pdf');
// 		const iframe = document.querySelector('iframe');
// 		iframe.src = url;
// 	});

// }


const pdfKit = require('pdfkit');

const blobStream = require('blob-stream');

function prueba (req, res){

	console.log('hola');
	const doc = new pdfKit;

	doc.pipe(res);
	doc.text('hello world', 25,25);



	doc.end();



	
	

}



module.exports = {
	confirmarFactura,
	pdf,
	VerFactura,
	VerFacturaId,
	prueba
};