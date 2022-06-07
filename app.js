const express = require('express');
const cors = require('cors');
const app = express();

// IMPORTACION RUTAS
const UsuarioRutas = require('./src/routes/usuario.routes');
const HotelRutas = require('./src/routes/hotel.routes');
// MIDDLEWARES
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//imagenes
app.use('/public', express.static(`${__dirname}/storage/imgs`));

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/productos
app.use('/api' , UsuarioRutas,HotelRutas);

module.exports = app;