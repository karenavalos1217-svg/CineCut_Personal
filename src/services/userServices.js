const Usuario = require('../models/Usuario');
const register = async (data) => {
  const { nombre, email, password } = data;
  
  const user = await Usuario.create({ nombre, email, password });
  
  return { ok: true, data };
};

module.exports = { register };