const mongoose = require('mongoose');

const AccesoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recurso: {
      type: String,
      enum: ['proyecto', 'vehiculo', 'coleccion_accesos', 'reporte'],
      required: true,
    },
    recursoId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    accion: {
      type: String,
      enum: ['leer', 'crear', 'actualizar', 'eliminar'],
      required: true,
    },
    detalles: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Acceso', AccesoSchema);