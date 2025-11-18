const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Acceso = require('../models/Acceso');

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Registro
router.post('/register', async (req, res) => {
  try {
    const { email, nombre, password, rol } = req.body;

    // Validaciones
    if (!email || !nombre || !password) {
      return res.status(400).json({ error: 'Por favor completa todos los campos' });
    }

    // Verificar si usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear usuario
    user = await User.create({
      email,
      nombre,
      password,
      rol: rol || 'visitante',
    });

    // Generar token
    const token = generateToken(user._id);

    // Registrar acceso
    await Acceso.create({
      usuario: user._id,
      recurso: 'reporte',
      accion: 'crear',
      detalles: `Registro de nuevo usuario: ${email}`,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ error: 'Por favor proporciona email y contraseña' });
    }

    // Buscar usuario
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken(user._id);

    // Registrar acceso
    await Acceso.create({
      usuario: user._id,
      recurso: 'reporte',
      accion: 'leer',
      detalles: `Login exitoso: ${email}`,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener usuario actual
router.get('/me', require('../middleware/authMiddleware').protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;