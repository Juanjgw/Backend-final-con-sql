const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Asegúrate de requerir el módulo 'path'
dotenv.config();
const passport = require('passport');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const { database } = require('./config/connection.sql');
const { authRouter } = require('./auth/auth.router');
const { ServiciosRouter } = require('./servicios/Servicios.router');
const facebookAuthRouter = require('./auth/facebook.auth.router');

console.log({
    authRouter,
    ServiciosRouter,
    facebookAuthRouter
});

const PORT = process.env.PORT || 4041;
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Configura la sesión
app.use(session({ secret: 'your secret', resave: false, saveUninitialized: true }));

// Inicializa Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas API
app.use('/api/auth', authRouter);
app.use('/api/auth/facebook', facebookAuthRouter);
app.use('/api/servicios', ServiciosRouter);

// Sirve archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Maneja todas las rutas con el archivo `index.html`
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log('Nuestra aplicación se ejecuta en el puerto: ' + PORT);
});
