const mongoose = require('mongoose');

const VehiculoSchema = new mongoose.Schema(
  {
    placa: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    tipo: {
      type: String,
      enum: ['volqueta', 'grua', 'excavadora', 'camion', 'otro'],
      required: true,
    },
    asignadoAProyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proyecto',
      default: null,
    },
    estado: {
      type: String,
      enum: ['disponible', 'en_uso', 'mantenimiento'],
      default: 'disponible',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehiculo', VehiculoSchema);