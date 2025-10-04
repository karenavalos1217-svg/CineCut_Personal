// src/config/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// formato de salida
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// configuración del logger
const logger = createLogger({
  level: 'info', // niveles: error, warn, info, http, verbose, debug, silly
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(), // imprime en consola
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // errores
    new transports.File({ filename: 'logs/combined.log' }) // todo
  ],
});

module.exports = logger;
