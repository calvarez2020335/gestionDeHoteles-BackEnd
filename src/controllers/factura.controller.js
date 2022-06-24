const Factura = require('../models/factura.model');
const Usuario = require('../models/usuario.model');
const Servicio = require('../models/servicio.model');
const Hotel = require('../models/hotel.model');
const UsuariosSubcrito = require('../models/usuariosSubcritos.model');
const GastosServicios = require('../models/gastosServicios.model');
const PdfkitConstruct = require('pdfkit-construct');

function confirmarFactura (req , res) {
	var idFactura = req.params.idFactu;
	var parametro = req.body;
	var facturaModelo = new Factura();
    

	Factura.findOne( {_id: idFactura}, (err, facturaEncotrada) =>{
		if (err) return res.status(500).send({ mensaje: 'error en la peticion del eliminar el carrito' });
		if (!facturaEncotrada) return res.status(500).send({ mensaje: 'error al eliminar el producto al carrito' });

		GastosServicios.find({Usuario: facturaEncotrada.Usuario} , (err, gastoEncontrado) =>{
			if (err) return res.status(500).send({ mensaje: 'error en la peticion del eliminar el carrito' });
			if (!gastoEncontrado) return res.status(500).send({ mensaje: 'error al eliminar el producto al carrito' });



			let totallocal = 0;
			let subTotalLocal = [];
			
			for (let i = 0; i < gastoEncontrado.length; i++) {

				subTotalLocal.push(gastoEncontrado[i].Precio);

				Factura.findOneAndUpdate ({_id: facturaEncotrada._id } , {$push: { servicios: { nombreServicios : gastoEncontrado[i].NombreSer , precio: gastoEncontrado[i].Precio}}} , {new: true} , (err, facturaActualzada) =>{
					if (err) return res.status(500).send({ mensaje: 'error en la peticion del eliminar el carrito' });
					if (!facturaActualzada) return res.status(500).send({ mensaje: 'error al eliminar el producto al carrito' });
			
					// console.log(facturaActualzada);
				});
			}
			for (let i = 0; i < subTotalLocal.length; i++) {
				totallocal += subTotalLocal[i];
			}
	
			Factura.findOneAndUpdate ({_id: facturaEncotrada._id } , { Subtotal : totallocal , total:  totallocal } , {new: true} , (err, facturaActualzada) =>{
				if (err) return res.status(500).send({ mensaje: 'error en la peticion del eliminar el carrito' });
				if (!facturaActualzada) return res.status(500).send({ mensaje: 'error al eliminar el producto al carrito' });
		
				console.log(facturaActualzada);
			});
			console.log(totallocal);
  


			return	res.status(200).send({ gastoEncontrado:  gastoEncontrado});

		});




	} );


    

}


function prueba (req, res) {



		
	Factura.findOne( {_id: '62b4d76c8b33472603c26da8'}, (err, facturaEncotrada) =>{
		if (err) return res.status(500).send({ mensaje: 'error en la peticion del eliminar el carrito' });
		if (!facturaEncotrada) return res.status(500).send({ mensaje: 'error al eliminar el producto al carrito' });
	
		UsuariosSubcrito.findOne( {usuario: facturaEncotrada.Usuario}, (err, UsuariosSubcritoEncontrado) =>{
			if (err) return res.status(500).send({ mensaje: 'error en la peticion del eliminar el carrito' });
			if (!UsuariosSubcritoEncontrado) return res.status(500).send({ mensaje: 'error al eliminar el producto al carrito' }); 

				
			Hotel.findOne({_id : UsuariosSubcritoEncontrado.hotel } , (err, HotelEncotrado) =>{
				if (err) return res.status(500).send({ mensaje: 'error en la peticion del eliminar el carrito' });
				if (!HotelEncotrado) return res.status(500).send({ mensaje: 'error al eliminar el producto al carrito' }); 
	
				Usuario.findOne({_id: UsuariosSubcritoEncontrado.usuario} , (err, usuarioEncontrado) =>{
					if (err) return res.status(500).send({ mensaje: 'error en la peticion del eliminar el carrito' });
					if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'error al eliminar el producto al carrito' }); 
		


					let count = 1;
					const registros = facturaEncotrada.servicios.map((prueba) => {
						const registro = {
	
							Num: count,
							nombre: prueba.nombreServicios,
							precio: prueba.precio,
	
						};
						count++;

						return registro;
					});


					// Create a document
					const doc = new PdfkitConstruct({
						size: 'A4',
						margins: {top: 20, left: 10, right: 10, bottom: 20},
						bufferPages: true,
					});

					// set the header to render in every page
					doc.setDocumentHeader({		
						height: '20%',
					// marginLeft: 45,
					// marginRight: 45,
					}, () => {
		
						// doc.image('images/kumtatz_propuesta_3.3.jpeg', 450, 10, { scale: 0.10 });


						doc.lineJoin('miter')
							.rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill('#155B98');

						doc.image('images/kumtatz_propuesta_3.3.jpeg', 495, 0, {fit: [80, 80]})
							.rect(495, 0, 80, 80)
							.stroke()
							.text('Fit', 495, 0);


						doc.fill('#ffff')
							.fontSize(20)
							.text( `hotel: ${HotelEncotrado.Nombre}`, doc.header.x, doc.header.y);
						doc.fill('#ffff')
							.fontSize(20)
							.text(`Nombre: ${usuarioEncontrado.nombre}`, doc.header.x + 0 , doc.header.y + 20);
					});

					// set the footer to render in every page
					// doc.setDocumentFooter({}, () => {

					// 	doc.lineJoin('miter')
					// 		.rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber).fill('#c2edbe');

					// 	doc.fill('#7416c8')
					// 		.fontSize(8)
					// 		.text(`Total: ${facturaEncotrada.total} Quetzales`, doc.footer.x, doc.footer.y + 10);
					

			
					// });


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
			
					});
					// add a table (you can add multiple tables with different columns)
					// make sure every column has a key. keys should be unique
					doc.addTable(
						[
							{key: 'Num', label: '#', align: 'center'},
							{key: 'nombre', label: 'SErvicios Prestados', align: 'center'},
							{key: 'precio' , label: 'precio Q', align: 'center'},
				
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
							{key: 'Num', label: '#', align: 'center'},
							{key: 'nombre', label: 'SErvicios Prestados', align: 'center'},
							{key: 'precio' , label: 'precio Q', align: 'center'},
				
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


					// render tables
					doc.render();

					// this should be the last
					// for this to work you need to set bufferPages to true in constructor options 
					// doc.setPageNumbers((p, c) => `Page ${p} of ${c}`, 'bottom right');

					doc.pipe(res);
					doc.end();

									
				});
			});
		});
	});

}


module.exports = {
	confirmarFactura,
	prueba
};