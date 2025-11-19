import express from "express";
import User from "../Models/Login_usuarios.js";
import argon2 from "argon2";
import { enviarCodigo } from "../Utils/enviarCodigo.js"; // asegúrate de crear esta función

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

    // 3. Generar código de 6 dígitos para 2FA
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    user.twoFactorCode = codigo;
    user.twoFactorExpires = Date.now() + 5 * 60 * 1000; // 5 minutos de validez
    await user.save();

    // 4. Enviar código por correo
    await enviarCodigo(user.correo, codigo);

    // 5. Responder al frontend indicando que requiere 2FA
    res.json({
      message: "Código enviado al correo",
      requires2FA: true,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
