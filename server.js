require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

// Conectar BD
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/vehiculos', require('./routes/vehiculos'));
app.use('/api/reportes', require('./routes/reportes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API en funcionamiento' });
});

// Error handler
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServidor corriendo en http://localhost:${PORT}`);
  console.log(`API Documentation:`);
  console.log(`   - Registro: POST /api/auth/register`);
  console.log(`   - Login: POST /api/auth/login`);
  console.log(`   - Proyectos: GET /api/proyectos`);
  console.log(`   - Vehículos: GET /api/vehiculos`);
  console.log(`   - Reportes: GET /api/reportes/accesos`);
  console.log(`\n`);
});