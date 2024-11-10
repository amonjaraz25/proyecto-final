// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'El usuario ya existe.' });

    user = new User({ username, password });
    await user.save();
    res.status(201).json({ msg: 'Usuario creado exitosamente.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor.' });
  }
});

// Ruta para iniciar sesión y generar un JWT
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta.' });

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor.' });
  }
});

module.exports = router;
