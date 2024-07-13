const PROPIEDADES_NECESARIAS = ['title', 'description', 'contactNumber'];

const VALIDACIONES_SERVICIOS = {
    'title': {
        validacion: (valor) => {
            return Boolean(valor) && (typeof(valor) === 'string') && valor.length > 15;
        },
        errorText: 'El título debe tener más de 15 caracteres'
    },
    'description': {
        validacion: (valor) => {
            return (Boolean(valor) && typeof(valor) === 'string' && valor.length > 100);
        },
        errorText: 'La descripción debe ser un string de más de 100 caracteres'
    },
    'contactNumber': {
        validacion: (valor) => {
            return (Boolean(valor) && valor.length > 10);
        },
        errorText: 'El Teléfono debe tener más de 10 números'
    }
}

const validarPropiedadesServicio = (Servicio) => {
    try {
        const propiedades_Servicio = Object.keys(Servicio);
        const propiedades_faltantes = [];
        const propiedades_sobrantes = [];

        for (let propiedad_necesaria of PROPIEDADES_NECESARIAS) {
            if (!propiedades_Servicio.includes(propiedad_necesaria)) {
                propiedades_faltantes.push(propiedad_necesaria);
            }
        }
        if (propiedades_faltantes.length > 0) {
            throw { campo: propiedades_faltantes[0], status: 400, message: 'Falta la propiedad [' + propiedades_faltantes[0] + ']' }
        }

        for (let propiedad of propiedades_Servicio) {
            if (!PROPIEDADES_NECESARIAS.includes(propiedad)) {
                propiedades_sobrantes.push(propiedad);
            }
        }
        if (propiedades_sobrantes.length > 0) {
            throw { campo: propiedades_sobrantes[0], status: 400, message: 'Sobra la propiedad [' + propiedades_sobrantes[0] + ']' }
        }

        for (let propiedad in VALIDACIONES_SERVICIOS) {
            let valor = Servicio[propiedad];
            if (!VALIDACIONES_SERVICIOS[propiedad].validacion(valor)) {
                throw { campo: propiedad, status: 400, message: VALIDACIONES_SERVICIOS[propiedad].errorText }
            }
        }

        Servicio.rating = 0;

        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = { validarPropiedadesServicio };

