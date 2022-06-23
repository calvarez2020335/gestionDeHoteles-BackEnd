const Factura = require('../models/factura.model');
const Usuario = require('../models/usuario.model');
const Servicio = require('../models/servicio.model');
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

	getDbData()
		.then(products => {

			for (let i = 0; i < products.length; i++) {
				products[i].amount = (products[i].price * products[i].quantity).toFixed(2);
				products[i].price = products[i].price.toFixed(2);
			}

			// Create a document
			const doc = new PdfkitConstruct({
				size: 'A4',
				margins: {top: 20, left: 10, right: 10, bottom: 20},
				bufferPages: true,
			});

			// set the header to render in every page
			doc.setDocumentHeader({}, () => {


				doc.lineJoin('miter')
					.rect(0, 0, doc.page.width, doc.header.options.heightNumber).fill('#ededed');

				doc.fill('#115dc8')
					.fontSize(20)
					.text('Hello world header', doc.header.x, doc.header.y);
			});

			// set the footer to render in every page
			doc.setDocumentFooter({}, () => {

				doc.lineJoin('miter')
					.rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber).fill('#c2edbe');

				doc.fill('#7416c8')
					.fontSize(8)
					.text('Hello world footer', doc.footer.x, doc.footer.y + 10);
			});


			// add a table (you can add multiple tables with different columns)
			// make sure every column has a key. keys should be unique
			doc.addTable(
				[
					{key: 'name', label: 'Product', align: 'left'},
					{key: 'brand', label: 'Brand', align: 'left'},
					{key: 'price', label: 'Price', align: 'right'},
					{key: 'quantity', label: 'Quantity'},
					{key: 'amount', label: 'Amount', align: 'right'}
				],
				products, {
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
			doc.setPageNumbers((p, c) => `Page ${p} of ${c}`, 'bottom right');

			doc.pipe(res);
			doc.end();
		})
		.catch(error => {
			res.status(200).send(error.stack);
		});
}

function getDbData() {

	return new Promise((resolve, reject) => {
		resolve([
			{
				'id': 7631,
				'SKU': 'HEH-9133',
				'name': 'On Cloud Nine Pillow On Cloud Nine Pillow On Cloud Nine Pillow On Cloud Nine Pillow',
				'price': 24.99,
				'brand': 'FabDecor',
				'quantity': 1,
				'created_at': '2018-03-03 17:41:13'
			},
			{
				'id': 7615,
				'SKU': 'HEH-2245',
				'name': 'Simply Sweet Blouse',
				'price': 42,
				'brand': 'Entity Apparel',
				'quantity': 2,
				'created_at': '2018-03-20 22:24:21'
			},
			{
				'id': 8100,
				'SKU': 'WKS-6016',
				'name': 'Uptown Girl Blouse',
				'price': 58,
				'brand': 'Entity Apparel',
				'quantity': 3,
				'created_at': '2018-03-16 21:55:28'
			}]);
	});
}


module.exports = {
	confirmarFactura,
	prueba
};