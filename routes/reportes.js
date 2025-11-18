const express = require('express');
const router = express.Router();
const Acceso = require('../models/Acceso');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET reportes de accesos
router.get('/accesos', protect, authorize('admin', 'analista'), async (req, res) => {
  try {
    const { desde, hasta, recurso, page = 1, limit = 10 } = req.query;

    // Construir filtro
    let filtro = {};

    if (desde || hasta) {
      filtro.timestamp = {};
      if (desde) filtro.timestamp.$gte = new Date(desde);
      if (hasta) filtro.timestamp.$lte = new Date(hasta);
    }

    if (recurso) filtro.recurso = recurso;

    // Contar total
    const total = await Acceso.countDocuments(filtro);

    // Obtener accesos paginados
    const accesos = await Acceso.find(filtro)
      .populate('usuario', 'email nombre rol')
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      data: accesos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET estadísticas de accesos
router.get('/estadisticas', protect, authorize('admin', 'analista'), async (req, res) => {
  try {
    const estadisticas = await Acceso.aggregate([
      {
        $group: {
          _id: '$recurso',
          count: { $sum: 1 },
          acciones: { $push: '$accion' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json({
      success: true,
      data: estadisticas,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET accesos por usuario
router.get('/usuario/:usuarioId', protect, authorize('admin', 'analista'), async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const total = await Acceso.countDocuments({ usuario: usuarioId });

    const accesos = await Acceso.find({ usuario: usuarioId })
      .populate('usuario', 'email nombre rol')
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      data: accesos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;