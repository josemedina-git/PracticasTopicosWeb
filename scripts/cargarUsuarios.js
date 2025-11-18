require('dotenv').config();
const mongoose = require('mongoose');
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

const cargarUsuarios = async () => {
  try {
    // Limpiar usuarios anteriores (opcional)
    // await User.deleteMany({});

    const usuarios = [
      {
        email: 'admin@movilidad.com',
        nombre: 'Admin Sistema',
        password: 'admin123456',
        rol: 'admin',
      },
      {
        email: 'analista@movilidad.com',
        nombre: 'Analista Datos',
        password: 'analista123456',
        rol: 'analista',
      },
      {
        email: 'visitante@movilidad.com',
        nombre: 'Usuario Visitante',
        password: 'visitante123456',
        rol: 'visitante',
      },
      {
        email: 'gerente@movilidad.com',
        nombre: 'Gerente Proyecto',
        password: 'gerente123456',
        rol: 'analista',
      },
    ];

    for (const usuarioData of usuarios) {
      const existe = await User.findOne({ email: usuarioData.email });
      if (!existe) {
        const usuario = await User.create(usuarioData);
        console.log(`Usuario creado: ${usuario.email} (${usuario.rol})`);
      } else {
        console.log(`Usuario ya existe: ${usuarioData.email}`);
      }
    }

    console.log('\nCarga de usuarios completada');
    process.exit(0);
  } catch (error) {
    console.error('Error cargando usuarios:', error.message);
    process.exit(1);
  }
};

(async () => {
  await conectarBD();
  await cargarUsuarios();
})();