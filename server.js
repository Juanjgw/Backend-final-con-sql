

// app.js (o donde tengas configurada tu aplicación Express)

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
dotenv.config();

const { database } = require('./config/connection.sql');
const { authRouter } = require('./auth/auth.router');
const { productRouter } = require('./products/products.router');
const { cartsRouter } = require('./carts/carts.router');
const { ServiciosRouter } = require('./servicios/Servicios.router'); // Importa el router de servicios
const facebookAuthRouter = require('./auth/facebook.auth.router');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

// Configura la sesión
app.use(session({ secret: 'your secret', resave: false, saveUninitialized: true }));

// Inicializa Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/auth/facebook', facebookAuthRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/servicios', ServiciosRouter); // Usa el router de servicios

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error en el servidor');
  });

// Iniciar el servidor
app.listen(PORT, () => {
    console.log('Nuestra aplicación se ejecuta en el puerto: ' + PORT);
});


