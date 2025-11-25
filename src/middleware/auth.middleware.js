const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_super_secreta_change_me';

// Middleware para verificar token
exports.verificarToken = (req, res, next) => {
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
exports.verificarRol = (rolesPermitidos) => {
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

// Middleware combinado
exports.proteger = (rolesPermitidos = []) => {
  return [
    exports.verificarToken,
    ...(rolesPermitidos.length > 0 ? [exports.verificarRol(rolesPermitidos)] : [])
  ];
};
