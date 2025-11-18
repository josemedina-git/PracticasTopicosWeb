const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');
const Acceso = require('../models/Acceso');
const { protect, authorize, logAcceso } = require('../middleware/authMiddleware');

// GET todos los proyectos
router.get('/', protect, authorize('admin', 'analista'), logAcceso('proyecto', 'leer'), async (req, res) => {
  try {
    const proyectos = await Proyecto.find();
    
    res.json({
      success: true,
      count: proyectos.length,
      data: proyectos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET proyecto por ID
router.get('/:id', protect, logAcceso('proyecto', 'leer'), async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({
      success: true,
      data: proyecto,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear proyecto
router.post('/', protect, authorize('admin'), logAcceso('proyecto', 'crear'), async (req, res) => {
  try {
    const { nombre, ubicacion, estado, fechaInicio, cliente } = req.body;

    if (!nombre || !ubicacion || !fechaInicio || !cliente) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const proyecto = await Proyecto.create({
      nombre,
      ubicacion,
      estado,
      fechaInicio,
      cliente,
    });

    res.status(201).json({
      success: true,
      data: proyecto,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;