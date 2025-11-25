const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'tu_clave_super_secreta_change_me';

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Mock data
const roles = [
  { id: 1, nombre: 'ADMIN' },
  { id: 2, nombre: 'CUSTOMER' }
];

const users = [
  { 
    id: 1, 
    email: 'admin@test.com', 
    password: 'admin123',
    nombre: 'Admin User',
    RoleId: 1,
    Role: { id: 1, nombre: 'ADMIN' }
  },
  { 
    id: 2, 
    email: 'customer@test.com', 
    password: 'customer123',
    nombre: 'Customer User',
    RoleId: 2,
    Role: { id: 2, nombre: 'CUSTOMER' }
  }
];

const categories = [
  { id: 1, nombre: 'Electrónica', descripcion: 'Productos electrónicos' },
  { id: 2, nombre: 'Ropa', descripcion: 'Prendas de vestir' },
  { id: 3, nombre: 'Libros', descripcion: 'Literatura y educación' }
];

const products = [
  {
    id: 1,
    nombre: 'Laptop Dell XPS 13',
    precio: '899.99',
    description: 'Laptop ultraportátil con procesador Intel i7',
    imageUrl: 'https://via.placeholder.com/300x300?text=Laptop',
    CategoryId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    nombre: 'iPhone 15 Pro',
    precio: '999.99',
    description: 'Smartphone premium con cámara avanzada',
    imageUrl: 'https://via.placeholder.com/300x300?text=iPhone',
    CategoryId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    nombre: 'Smartwatch Samsung',
    precio: '199.99',
    description: 'Reloj inteligente con seguimiento de salud',
    imageUrl: 'https://via.placeholder.com/300x300?text=Smartwatch',
    CategoryId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    nombre: 'Camiseta Nike',
    precio: '39.99',
    description: 'Camiseta deportiva de algodón',
    imageUrl: 'https://via.placeholder.com/300x300?text=Camiseta',
    CategoryId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    nombre: 'Zapatillas Adidas',
    precio: '79.99',
    description: 'Zapatillas deportivas cómodas',
    imageUrl: 'https://via.placeholder.com/300x300?text=Zapatillas',
    CategoryId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Middleware para verificar token
const verificarToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
        data: null
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
      data: null
    });
  }
};

// Middleware para verificar rol
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        data: null
      });
    }
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para acceder a este recurso',
        data: null
      });
    }
    next();
  };
};

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'API E-commerce funcionando' });
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password, nombre, roleNombre = 'CUSTOMER' } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email y password son obligatorios',
      data: null
    });
  }

  const usuarioExistente = users.find(u => u.email === email);
  if (usuarioExistente) {
    return res.status(400).json({
      success: false,
      message: 'El email ya está registrado',
      data: null
    });
  }

  let role = roles.find(r => r.nombre === roleNombre);
  if (!role) {
    role = { id: roles.length + 1, nombre: roleNombre };
    roles.push(role);
  }

  const newUser = {
    id: Math.max(...users.map(u => u.id), 0) + 1,
    email,
    password,
    nombre,
    RoleId: role.id,
    Role: role
  };

  users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: role.nombre },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        nombre: newUser.nombre,
        role: role.nombre
      },
      token
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email y password son obligatorios',
      data: null
    });
  }

  const usuario = users.find(u => u.email === email && u.password === password);

  if (!usuario) {
    return res.status(401).json({
      success: false,
      message: 'Email o password incorrecto',
      data: null
    });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, role: usuario.Role.nombre },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Inicio de sesión exitoso',
    data: {
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        role: usuario.Role.nombre
      },
      token
    }
  });
});

app.get('/api/auth/me', verificarToken, (req, res) => {
  const usuario = users.find(u => u.id === req.user.id);
  res.json({
    success: true,
    message: 'Usuario obtenido',
    data: usuario
  });
});

// Products endpoints
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    message: 'Productos obtenidos exitosamente',
    data: products.map(p => ({
      ...p,
      Category: categories.find(c => c.id === p.CategoryId)
    }))
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Producto no encontrado',
      data: null
    });
  }

  res.json({
    success: true,
    message: 'Producto obtenido exitosamente',
    data: {
      ...product,
      Category: categories.find(c => c.id === product.CategoryId)
    }
  });
});

app.post('/api/products', verificarToken, verificarRol(['ADMIN']), (req, res) => {
  const { nombre, precio, description, categoryId, imageUrl } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({
      success: false,
      message: 'Nombre y precio son obligatorios',
      data: null
    });
  }

  const newProduct = {
    id: Math.max(...products.map(p => p.id), 0) + 1,
    nombre,
    precio,
    description,
    imageUrl,
    CategoryId: categoryId,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Producto creado exitosamente',
    data: newProduct
  });
});

app.put('/api/products/:id', verificarToken, verificarRol(['ADMIN']), (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Producto no encontrado',
      data: null
    });
  }

  const { nombre, precio, description, categoryId, imageUrl } = req.body;

  if (nombre) product.nombre = nombre;
  if (precio) product.precio = precio;
  if (description) product.description = description;
  if (categoryId) product.CategoryId = categoryId;
  if (imageUrl) product.imageUrl = imageUrl;
  product.updatedAt = new Date();

  res.json({
    success: true,
    message: 'Producto actualizado exitosamente',
    data: product
  });
});

app.delete('/api/products/:id', verificarToken, verificarRol(['ADMIN']), (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Producto no encontrado',
      data: null
    });
  }

  products.splice(index, 1);

  res.json({
    success: true,
    message: 'Producto eliminado exitosamente',
    data: null
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor mock corriendo en http://localhost:${PORT}`);
  console.log('✅ API disponible en http://localhost:' + PORT + '/api/products');
  console.log('\n📝 Credenciales de prueba:');
  console.log('Admin: admin@test.com / admin123');
  console.log('Customer: customer@test.com / customer123');
});

