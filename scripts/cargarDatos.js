require('dotenv').config();
const mongoose = require('mongoose');
const Proyecto = require('../models/Proyecto');
const Vehiculo = require('../models/Vehiculo');
const Acceso = require('../models/Acceso');
const User = require('../models/User');

const conectarBD = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const cargarDatos = async () => {
  try {
    // Obtener usuarios para referencias
    const usuarios = await User.find();
    if (usuarios.length === 0) {
      console.error('No hay usuarios. Ejecuta primero: npm run seed');
      process.exit(1);
    }

    // Crear proyectos
    const proyectos = await Proyecto.insertMany([
      {
        nombre: 'Avenida Principal Remodelación',
        ubicacion: 'Centro de la ciudad',
        estado: 'en_construccion',
        fechaInicio: new Date('2024-01-15'),
        cliente: 'Municipalidad Central',
      },
      {
        nombre: 'Puente sobre Rio Santa',
        ubicacion: 'Zona norte',
        estado: 'planeo',
        fechaInicio: new Date('2024-06-01'),
        cliente: 'Gobierno Regional',
      },
      {
        nombre: 'Carretera Panamericana',
        ubicacion: 'Zona sur',
        estado: 'en_construccion',
        fechaInicio: new Date('2023-11-10'),
        cliente: 'Ministerio de Transportes',
      },
    ]);

    console.log(`${proyectos.length} proyectos creados`);

    // Crear vehículos
    const vehiculos = await Vehiculo.insertMany([
      {
        placa: 'MOV001',
        tipo: 'volqueta',
        asignadoAProyecto: proyectos[0]._id,
        estado: 'en_uso',
      },
      {
        placa: 'MOV002',
        tipo: 'excavadora',
        asignadoAProyecto: proyectos[1]._id,
        estado: 'disponible',
      },
      {
        placa: 'MOV003',
        tipo: 'grua',
        asignadoAProyecto: proyectos[0]._id,
        estado: 'en_uso',
      },
      {
        placa: 'MOV004',
        tipo: 'camion',
        asignadoAProyecto: null,
        estado: 'mantenimiento',
      },
      {
        placa: 'MOV005',
        tipo: 'volqueta',
        asignadoAProyecto: proyectos[2]._id,
        estado: 'en_uso',
      },
    ]);

    console.log(`${vehiculos.length} vehículos creados`);

    // Crear registros de acceso
    const accesos = [];
    const recursos = ['proyecto', 'vehiculo', 'reporte'];
    const acciones = ['leer', 'crear', 'actualizar', 'eliminar'];

    for (let i = 0; i < 20; i++) {
      accesos.push({
        usuario: usuarios[Math.floor(Math.random() * usuarios.length)]._id,
        recurso: recursos[Math.floor(Math.random() * recursos.length)],
        recursoId: i % 2 === 0 ? proyectos[Math.floor(Math.random() * proyectos.length)]._id : vehiculos[Math.floor(Math.random() * vehiculos.length)]._id,
        accion: acciones[Math.floor(Math.random() * acciones.length)],
        detalles: `Acceso de ejemplo ${i + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      });
    }

    await Acceso.insertMany(accesos);
    console.log(`${accesos.length} registros de acceso creados`);

    console.log('\nCarga de datos completada');
    process.exit(0);
  } catch (error) {
    console.error('Error cargando datos:', error.message);
    process.exit(1);
  }
};

(async () => {
  await conectarBD();
  await cargarDatos();
})();