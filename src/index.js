const express = require('express');
require('dotenv').config();

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const sequelize = require('./config/db');
const routes = require('./routes');

// Modelo opcional
const Recorrido = require('./models/usermodels.js'); 

// Winston
const logger = require('./config/logger');  // nuevo logger central
const loggerMiddleware = require('./middlewares/loggerMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// === M O R G A N ===
// Log personalizado con user-agent
morgan.token('ua', req => req.get('User-Agent'));
app.use(morgan(':method :url :status :response-time ms - :ua'));

const logsDir = path.join(__dirname, '../Logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
const errorLogStream  = fs.createWriteStream(path.join(logsDir, 'error.log'),  { flags: 'a' });

// 1) Consola
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));          
} else {
  app.use(morgan('combined'));     
}

// 2) Archivo access.log
app.use(morgan('combined', { stream: accessLogStream }));

// 3) Archivo error.log (solo ≥ 400)
app.use(morgan('combined', {
  stream: errorLogStream,
  skip: (_req, res) => res.statusCode < 400
}));

// === W I N S T O N ===
// Middleware global para loguear cada request con winston
app.use(loggerMiddleware);

// Rutas
app.use(routes.unprotectedroutes);
app.use('/api', routes.usuariosRoutes);

async function startServer() {
  try {
    await sequelize.sync();
    logger.info('DB is ready'); // winston en lugar de console.log

    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('Error al sincronizar la base de datos: ' + err.message); // winston error
    process.exit(1);
  }
}

startServer();
