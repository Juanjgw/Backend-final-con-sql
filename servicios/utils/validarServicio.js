const PROPIEDADES_NECESARIAS = ['id','title', 'rating', 'contactNumber', 'description']

const VALIDACIONES_PRODUCTO = {
    'title': {
        validacion: (valor) => {
            return Boolean(valor) && (typeof(valor) === 'string') && valor.length > 3;
        },
        errorText: 'El título debe ser un valor verdadero con una longitud mayor a 3 caracteres'
    },
    'rating': {
        validacion: (valor) => {
            return (Boolean(valor) && !isNaN(valor) && valor >= 1 && valor <= 5);
        },
        errorText: 'El Rating debe ser un número válido entre 1 y 5'
    },
    'description': {
        validacion: (valor) => {
            return (Boolean(valor) && typeof(valor) === 'string' && valor.length > 20);
        },
        errorText: 'La descripción debe ser un string de más de 20 caracteres'
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
        const propiedades_Servicio = Object.keys(Servicio)
        const propiedades_faltantes = []
        const propiedades_sobrantes = []

        for (let propiedad_necesaria of PROPIEDADES_NECESARIAS) {
            if (!propiedades_Servicio.includes(propiedad_necesaria)) {
                propiedades_faltantes.push(propiedad_necesaria)
            }
        }
        if (propiedades_faltantes.length > 0) {
            throw { status: 400, message: 'Faltan las propiedades [' + propiedades_faltantes.join(', ') + ']' }
        }

        for (let propiedad of propiedades_Servicio) {
            if (!PROPIEDADES_NECESARIAS.includes(propiedad)) {
                propiedades_sobrantes.push(propiedad)
            }
        }
        if (propiedades_sobrantes.length > 0) {
            throw { status: 400, message: 'Sobran las propiedades [' + propiedades_sobrantes.join(', ') + ']' }
        }

        for (let propiedad in VALIDACIONES_PRODUCTO) {
            let valor = Servicio[propiedad]
            if (!VALIDACIONES_PRODUCTO[propiedad].validacion(valor)) {
                throw { status: 400, message: VALIDACIONES_PRODUCTO[propiedad].errorText }
            }
        }
        return true
    } catch (error) {
        throw error
    }
}

module.exports = { validarPropiedadesServicio }
