const express = require('express')
const router = express.Router()
const productoController = require('../controllers/product.controller')
const { proteger } = require('../middleware/auth.middleware')

router.get('/', productoController.getAllProducts);
router.get('/:id', productoController.getProductById);
router.post('/', ...proteger(['ADMIN']), productoController.createProduct);
router.put('/:id', ...proteger(['ADMIN']), productoController.updateProduct);
router.delete('/:id', ...proteger(['ADMIN']), productoController.deleteProduct)

module.exports = router