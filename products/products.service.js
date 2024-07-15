const { CustomError } = require("../errors/customErrorManager")
const { insertarProducto, seleccionarProductoPorId, deleteProductoPorId, seleccionarProductos } = require("./products.repository")
const { validarPropiedadesProducto } = require("./utils/validarProducto")

const crearProducto = async (producto) =>{
    try{
       
        const paso = validarPropiedadesProducto(producto)
        
        if(paso){
            const idCreado = await insertarProducto(producto)
            return {ok:true,message:`Producto creado con id ${idCreado}`, idCreado: idCreado}
        }
        else{
            throw {status: 400, message: 'Exception: No se pasaron las validaciones del producto'}
        }
    }
    catch(error){ 
        if(error.status){
            throw error
        }
        else{
            throw {status: 500, message: 'Error interno del servidor service de insertar'}
        }
    }
}

const obtenerProductoPorId = async (pid) =>{
    try{
        const producto = await seleccionarProductoPorId(pid)
        return {ok: true, status: 200, producto}
    }
    catch(error){
        if(error.status){
            throw error
        }
        else{
            throw {status: 500, message: 'Error interno del servidor'}
        }
    }
}



const eliminarProductoPorId = async (pid)=>{
    try{
        const producto = await deleteProductoPorId (pid)
        return {ok:true, status:200, producto}
    }
    catch (error){
        if(error.status){
            throw error
        }
        else{
            throw {status:500, message: "Error interno del servidor"}
        }
    }
}


const buscarProductos = async () => {
    try{
        const productos = await seleccionarProductos()
        if(productos.length === 0){
            throw new CustomError('No hay productos', 404)
        }
        return {status: 200, message: 'productos obtenidos', productos: productos}
    }
    catch(error){
        throw error
    }
} 


module.exports = {crearProducto, obtenerProductoPorId, eliminarProductoPorId, buscarProductos}



