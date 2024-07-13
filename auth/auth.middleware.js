const { validacionExistencia } = require("../helpers/validation.helper");
const jwt = require('jsonwebtoken');

const verifyTokenMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!validacionExistencia(token) || !isNaN(token) || token === 'null' || token === 'undefined') {
        return res.status(400).json({ status: 400, message: 'Debes proporcionar un token válido' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, datos) => {
        if (error) {
            return res.status(401).json({ status: 401, message: 'Sin autorización, token inválido' });
        } else {
            req.user = datos; // Asigna los datos decodificados del token a req.user
            next(); // Continúa con el siguiente middleware o controlador
        }
    });
};

module.exports = { verifyTokenMiddleware };

