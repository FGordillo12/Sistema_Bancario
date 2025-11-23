import express from 'express';
import Cliente from '../Models/cliente.js';
import argon2 from "argon2";

const router = express.Router();

router.post('/crearCliente', async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    const existe = await Cliente.findOne({ correo });
    if (existe) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const hash = await argon2.hash(contraseña);

    const nuevoCliente = new Cliente({
      nombre,
      correo,
      contraseña: hash,
      rol: "cliente"    
    });

    await nuevoCliente.save();

    res.json({ mensaje: "Cliente creado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
