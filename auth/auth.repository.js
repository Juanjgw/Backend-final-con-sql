const { database, query} = require("../config/connection.sql")



const buscarUsuarioPorEmail = async (email) =>{
     
    try {
        const consultaExistencia = `SELECT * FROM usuarios WHERE email = ?`
        const resultados = await query(consultaExistencia, [email])
        if(resultados.length > 0){
            return resultados[0]
        }
        else{
            return null
        }
    }
    catch (error) {
        console.error('SQL_Error al seleccionar usuarios por email', error)
        throw {status: 500, message: 'Error interno en el servidor'}
    }
}




const insertarUsuario = async (usuario) =>{
    try{
        const consulta = 'INSERT INTO usuarios SET ?'


        const resultado = await query(consulta, usuario)

        return true
    }
    catch(error){
        throw {status: 500, message: 'Error interno en el servidor'}
    }
}



module.exports = {buscarUsuarioPorEmail, insertarUsuario}


