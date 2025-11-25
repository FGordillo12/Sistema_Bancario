import express from "express";
import Usuario from "../Models/usuario.js";
import argon2 from "argon2";

const router = express.Router();

router.post("/registro", async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;
    
    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const hash = await argon2.hash(contraseña);

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña: hash,
      rol: "admin"
    });

    await nuevoUsuario.save();

    res.json({ mensaje: "Usuario registrado correctamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
