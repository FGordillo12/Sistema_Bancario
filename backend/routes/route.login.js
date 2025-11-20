import express from "express";
import Usuario from "../Models/usuario.js";
import argon2 from "argon2";
import { enviarCodigo } from "../Utils/enviarCodigo.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo: email });
    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Validar contraseña
    const passwordValid = await argon2.verify(usuario.contraseña, password);
    if (!passwordValid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar código 2FA de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar código y expiración como Date real
    usuario.twoFactorCode = codigo;
    usuario.twoFactorExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
    await usuario.save();

    console.log(
      "2FA guardado:",
      usuario.twoFactorCode,
      usuario.twoFactorExpires
    );

    // Enviar código por correo
    await enviarCodigo(usuario.correo, codigo);

    // Respuesta al frontend
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
