const { buscarUsuarioPorEmail, insertarUsuario } = require("./auth.repository");
const bcrypt = require('bcrypt');
const { validacionUsuario } = require("./utils/validationUser.util");
const jwt = require('jsonwebtoken');

const registerService = async (usuario) => {
    try {
        const { email, password, confirmPassword } = usuario;

        validacionUsuario({ email, password, confirmPassword });

        const usuarioExistente = await buscarUsuarioPorEmail(email);

        if (usuarioExistente) {
            throw { status: 400, message: 'ERROR: email ya registrado' };
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await insertarUsuario({ email, password: passwordHash });

        if (result) {
            return { ok: true, message: 'Se insertó un usuario' };
        }
    } catch (error) {
        if (error.status) {
            throw error;
        } else {
            throw { status: 500, message: 'Error interno del servidor' };
        }
    }
};

const loginService = async (usuario) => {
    try {
        const { email, password } = usuario;

        validacionUsuario(usuario);

        const usuarioExistente = await buscarUsuarioPorEmail(email);

        if (!usuarioExistente) {
            throw { status: 400, message: 'No existe usuario con ese email' };
        }

        const esCorrecta = await bcrypt.compare(password, usuarioExistente.password);

        if (!esCorrecta) {
            throw { status: 400, message: 'Contraseña incorrecta' };
        } else {
            const token = jwt.sign({ email, user_id: usuarioExistente.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            return token;
        }
    } catch (error) {
        if (error.status) {
            throw error;
        } else {
            throw { status: 500, message: 'Error interno del servidor' };
        }
    }
};

const facebookLoginService = async (profile) => {
    try {
        const { id, displayName, emails } = profile;
        const email = emails && emails.length > 0 ? emails[0].value : null;

        if (!email) {
            throw { status: 400, message: 'No se pudo obtener el email de Facebook' };
        }

        let usuario = await buscarUsuarioPorEmail(email);

        if (!usuario) {
            usuario = await insertarUsuario({ email, facebookId: id, nombre: displayName });
        }

        const token = jwt.sign({ email, user_id: usuario.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        return token;
    } catch (error) {
        if (error.status) {
            throw error;
        } else {
            throw { status: 500, message: 'Error interno del servidor' };
        }
    }
};

module.exports = { registerService, loginService, facebookLoginService };

