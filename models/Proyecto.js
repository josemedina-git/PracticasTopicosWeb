const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    ubicacion: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ['planeo', 'en_construccion', 'finalizado'],
      default: 'planeo',
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    cliente: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Proyecto', ProyectoSchema);