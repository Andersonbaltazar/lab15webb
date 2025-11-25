const express = require('express')
const router = express.Router()
const productoController = require('../controllers/product.controller')
const { proteger } = require('../middleware/auth.middleware')

// Mock data for production
const mockProducts = [
  { id: 1, name: 'Laptop', price: 1200, description: 'Gaming Laptop', imageUrl: 'https://via.placeholder.com/300', categoryId: 1 },
  { id: 2, name: 'Mouse', price: 25, description: 'Wireless Mouse', imageUrl: 'https://via.placeholder.com/300', categoryId: 2 },
  { id: 3, name: 'Monitor', price: 350, description: '4K Monitor', imageUrl: 'https://via.placeholder.com/300', categoryId: 1 }
];

// En producción, retornar mock data
if (process.env.NODE_ENV === 'production') {
  router.get('/', (req, res) => {
    res.json(mockProducts);
  });
  
  router.get('/:id', (req, res) => {
    const product = mockProducts.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  });
  
  router.post('/', ...proteger(['ADMIN']), (req, res) => {
    res.status(201).json({ message: 'Mock: Producto creado', ...req.body });
  });
  
  router.put('/:id', ...proteger(['ADMIN']), (req, res) => {
    res.json({ message: 'Mock: Producto actualizado', id: req.params.id });
  });
  
  router.delete('/:id', ...proteger(['ADMIN']), (req, res) => {
    res.json({ message: 'Mock: Producto eliminado', id: req.params.id });
  });
} else {
  // En desarrollo, usar controladores reales
  router.get('/', productoController.getAllProducts);
  router.get('/:id', productoController.getProductById);
  router.post('/', ...proteger(['ADMIN']), productoController.createProduct);
  router.put('/:id', ...proteger(['ADMIN']), productoController.updateProduct);
  router.delete('/:id', ...proteger(['ADMIN']), productoController.deleteProduct)
}

module.exports = router