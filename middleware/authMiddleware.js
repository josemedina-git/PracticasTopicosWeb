const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Acceso = require('../models/Acceso');

// Proteger rutas
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'No autorizado para acceder a esta ruta' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token no válido' });
  }
};

// Autorizar por roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        error: `Usuario con rol '${req.user.rol}' no tiene permisos para acceder a este recurso`,
      });
    }
    next();
  };
};

// Registrar acceso
exports.registrarAcceso = async (recurso, accion, recursoId = null, detalles = '') => {
  try {
    await Acceso.create({
      usuario: recursoId ? null : null,
      recurso,
      recursoId,
      accion,
      detalles,
    });
  } catch (error) {
    console.error('Error registrando acceso:', error);
  }
};

// Middleware para registrar accesos automáticamente
exports.logAcceso = (recurso, accion) => {
  return async (req, res, next) => {
    const recursoId = req.params.id || null;
    
    // Capturar response original
    const originalSend = res.send;
    
    res.send = function (data) {
      // Solo registrar si la request fue exitosa
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        Acceso.create({
          usuario: req.user._id,
          recurso,
          recursoId,
          accion,
          detalles: `${accion} - ${recurso}`,
        }).catch(err => console.error('Error registrando acceso:', err));
      }
      
      res.send = originalSend;
      return res.send(data);
    };
    
    next();
  };
};