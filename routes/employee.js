// routes/employee.js
const express = require('express');
const Employee = require('../models/employee');
const authenticate = require('../middleware/auth');
const router = express.Router();

// Ruta para agregar un nuevo empleado
router.post('/', authenticate, async (req, res) => {
  const { name, surname, phone, email, address } = req.body;
  try {
    const newEmployee = new Employee({ name, surname, phone, email, address });
    await newEmployee.save();
    res.status(201).json({ msg: 'Empleado agregado exitosamente.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al agregar empleado.' });
  }
});

// Ruta para modificar un empleado
router.put('/:id', authenticate, async (req, res) => {
  const { name, surname, phone, email, address } = req.body;
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, { name, surname, phone, email, address }, { new: true });
    if (!employee) return res.status(404).json({ msg: 'Empleado no encontrado.' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar empleado.' });
  }
});

// Ruta para eliminar un empleado
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ msg: 'Empleado no encontrado.' });
    res.json({ msg: 'Empleado eliminado exitosamente.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar empleado.' });
  }
});

// Ruta para buscar empleados por nombre
router.get('/search', authenticate, async (req, res) => {
  const { name } = req.query;
  try {
    const employees = await Employee.find({ name: new RegExp(name, 'i') });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ msg: 'Error al buscar empleados.' });
  }
});

module.exports = router;
