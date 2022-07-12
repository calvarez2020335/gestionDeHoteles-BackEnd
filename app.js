const express = require('express');
const cors = require('cors');
const app = express();

// IMPORTACION RUTAS
const UsuarioRutas = require('./src/routes/usuario.routes');
const HotelRutas = require('./src/routes/hotel.routes');
const EventoRutas = require('./src/routes/evento.routes');
const HabitacionRutas = require('./src/routes/habitacion.routes');
const ReservacionRutas = require('./src/routes/reservacion.routes');
const ServiciosRutas = require('./src/routes/servicio.routes');
const FacturasRutas = require('./src/routes/factura.routes');
const HistorialRutas = require('./src/routes/historial.routes');
// MIDDLEWARES
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//imagenes
app.use('/public', express.static(`${__dirname}/storage/imgs`));

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/productos
app.use('/api' , UsuarioRutas,HotelRutas,EventoRutas,HabitacionRutas, ReservacionRutas, ServiciosRutas , FacturasRutas, HistorialRutas);

module.exports = app;