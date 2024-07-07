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
const facebookAuthRouter = require('./auth/facebook.auth.router'); // Asegúrate de crear este archivo y configurarlo correctamente

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

// Configura la sesión
app.use(session({ secret: 'your secret', resave: false, saveUninitialized: true }));

// Inicializa Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/auth/facebook', facebookAuthRouter); // Añade esta línea para las rutas de Facebook
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log('Nuestra aplicacion se ejecuta en el puerto: ' + PORT);
});
