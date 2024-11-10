// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'Acceso denegado. No se encontró token.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Guardar información del usuario decodificada
    next();
  } catch (err) {
    return res.status(400).json({ msg: 'Token no válido.' });
  }
};

module.exports = authenticate;
