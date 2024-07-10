const express = require('express')
const { postProductController, getProductByIdController, deleteProductByIdController, getAllProducts } = require('./products.controller')

const productRouter = express.Router()

productRouter.get('/', getAllProducts)
productRouter.post('/', postProductController)
productRouter.put('/')
productRouter.delete('/:pid', deleteProductByIdController)
productRouter.get('/:pid', getProductByIdController)


module.exports = {productRouter}