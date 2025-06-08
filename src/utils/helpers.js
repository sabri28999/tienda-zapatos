// src/utils/helpers.js

/**
 * Envuelve un handler asíncrono y propaga errores al middleware de Express.
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise
    .resolve(fn(req, res, next))
    .catch(next);
};

/**
 * Extrae solo las propiedades permitidas de un objeto.
 * @param {Object} obj - El objeto origen
 * @param {string[]} keys - Array con las claves a extraer
 * @returns {Object} nuevo objeto solo con las claves especificadas
 */
const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

/**

 * @param {Response} res - objeto de respuesta de Express
 * @param {number} statusCode - código HTTP
 * @param {Object} data - datos a devolver
 * @param {string} [message] - mensaje opcional
 */
 
const sendResponse = (res, statusCode, data, message = '') => {
  res.status(statusCode).json({ message, data });
};

module.exports = {
  catchAsync,
  pick,
  sendResponse,
};
