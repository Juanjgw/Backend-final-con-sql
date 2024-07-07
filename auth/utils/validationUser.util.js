const { validacionExistencia, validacionEmail } = require("../../helpers/validation.helper");

const validacionUsuario = (usuario) => {
    
    if (!validacionExistencia(usuario.email)) {
        throw { message: 'Correo electrónico inexistente', status: 400 };
    }
    if (!validacionExistencia(usuario.password)) {
        throw { message: 'Contraseña inexistente', status: 400 };
    }

    if (!validacionEmail(usuario.email)) {
        throw { message: 'Correo electrónico incorrecto', status: 400 };
    }

    
    if (usuario.confirmPassword && usuario.password !== usuario.confirmPassword) {
        throw { message: 'Las contraseñas no coinciden', status: 400 };
    }
};

module.exports = { validacionUsuario };
