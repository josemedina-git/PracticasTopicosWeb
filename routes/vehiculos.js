const express = require('express');
const router = express.Router();
const Vehiculo = require('../models/Vehiculo');
const { protect, logAcceso } = require('../middleware/authMiddleware');

// GET todos los vehículos
router.get('/', protect, logAcceso('vehiculo', 'leer'), async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find().populate('asignadoAProyecto');

    res.json({
      success: true,
      count: vehiculos.length,
      data: vehiculos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET vehículo por ID
router.get('/:id', protect, logAcceso('vehiculo', 'leer'), async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id).populate('asignadoAProyecto');

    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json({
      success: true,
      data: vehiculo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear vehículo
router.post('/', protect, logAcceso('vehiculo', 'crear'), async (req, res) => {
  try {
    const { placa, tipo, estado } = req.body;

    if (!placa || !tipo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const vehiculo = await Vehiculo.create({
      placa: placa.toUpperCase(),
      tipo,
      estado,
    });

    res.status(201).json({
      success: true,
      data: vehiculo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;