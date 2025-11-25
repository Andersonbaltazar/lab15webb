const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_super_secreta_change_me';
const JWT_EXPIRE = '24h';

// Register
exports.register = async (req, res) => {
  try {
    const { email, password, nombre, roleNombre = 'CUSTOMER' } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son obligatorios',
        data: null
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado',
        data: null
      });
    }

    // Buscar el rol
    let role = await Role.findOne({ where: { nombre: roleNombre } });
    if (!role) {
      role = await Role.create({ nombre: roleNombre });
    }

    // Crear usuario
    const usuario = await User.create({
      email,
      password,
      nombre,
      RoleId: role.id
    });

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: role.nombre },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          role: role.nombre
        },
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      data: null
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son obligatorios',
        data: null
      });
    }

    // Buscar usuario
    const usuario = await User.findOne({ 
      where: { email },
      include: [{ model: Role, attributes: ['nombre'] }]
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Email o password incorrecto',
        data: null
      });
    }

    // Validar contraseña
    const passwordValido = await usuario.validarPassword(password);
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Email o password incorrecto',
        data: null
      });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.Role.nombre },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      data: null
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.user.id, {
      include: [{ model: Role, attributes: ['nombre'] }],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'Usuario obtenido',
      data: usuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      data: null
    });
  }
};
