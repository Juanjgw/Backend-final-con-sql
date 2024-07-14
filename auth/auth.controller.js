const { validacionExistencia } = require("../helpers/validation.helper");
const { buscarUsuarioPorEmail } = require("./auth.repository");
const { registerService, loginService, facebookLoginService } = require("./auth.service");
const jwt = require('jsonwebtoken');

const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await loginService({ email, password });
        const usuario= await buscarUsuarioPorEmail(email)
        res.status(200).json({ ok: true, message: 'Usuario logueado', token: token ,usuario:usuario});
    } catch (error) {
        res.status(error.status).json(error);
    }
}

const registerController = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    try {
        const result = await registerService({ email, password, confirmPassword });
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

const verifyTokenController = (req, res) => {
    const token = req.headers['authorization'];

    if (!validacionExistencia(token) || !isNaN(token) || token === 'null' || token === 'undefined') {
        res.status(400).json({ status: 400, message: 'Debes proporcionar un token válido' });
    }
    try {
        const esValido = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.status(200).json({ status: 200, message: 'Token válido, usuario logueado' });
    } catch (error) {
        res.status(401).json({ status: 401, message: 'Sin autorización, token inválido' });
    }
}

module.exports = { loginController, registerController, verifyTokenController };
