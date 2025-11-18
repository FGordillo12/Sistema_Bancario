import express from "express";
import User from "../Models/Login_usuarios.js";
import argon2 from "argon2";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const user = await User.findOne({ correo: email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // 2. Validar contraseña
    const passwordValid = await argon2.verify(user.contraseña, password);
    if (!passwordValid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // 3. Login ok
    res.json({ message: "Inicio de sesión exitoso" });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
