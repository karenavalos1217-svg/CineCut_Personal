const logger = require('../config/logger');

function loggerMiddleware(req, res, next) {
  res.on('finish', () => { // espera a que termine la respuesta
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
}

module.exports = loggerMiddleware;
