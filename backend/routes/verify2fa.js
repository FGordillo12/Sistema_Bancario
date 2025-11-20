import express from "express";
import Usuario from "../Models/usuario.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, token } = req.body;

    console.log("===== DEBUG VERIFY 2FA =====");
    console.log("Token recibido:", token);
    console.log("Email recibido:", email);

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo: email });
    if (!usuario) {
      console.log("Usuario no encontrado para email:", email);
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // DEBUG: mostrar exactamente lo que viene guardado
    console.log("Valor crudo twoFactorExpires:", usuario.twoFactorExpires);
    console.log("Tipo:", typeof usuario.twoFactorExpires);
    console.log("Instancia de Date:", usuario.twoFactorExpires instanceof Date);

    // Manejo seguro del valor de expiración
    let expires = null;
    if (usuario.twoFactorExpires instanceof Date) {
      expires = usuario.twoFactorExpires.getTime();
    } else if (!isNaN(Number(usuario.twoFactorExpires))) {
      expires = Number(usuario.twoFactorExpires);
    }

    console.log("Timestamp calculado:", expires);
    console.log("Fecha actual (ms):", Date.now());

    // Validar expiración
    if (!expires || expires < Date.now()) {
      console.log("Código expirado.");
      return res.status(400).json({ message: "Código expirado" });
    }

    // Comparar códigos
    if (usuario.twoFactorCode !== String(token).trim()) {
      console.log(
        "Código incorrecto. Esperado:",
        usuario.twoFactorCode,
        "Recibido:",
        token
      );
      return res.status(400).json({ message: "Código incorrecto" });
    }

    // Limpiar código de la base de datos
    usuario.twoFactorCode = null;
    usuario.twoFactorExpires = null;
    await usuario.save();

    // Generar JWT
    const jwtToken = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("2FA verificado correctamente para:", email);

    return res.json({
      message: "Autenticación exitosa",
      token: jwtToken,
    });
  } catch (error) {
    console.error("Error en verify-2fa:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
