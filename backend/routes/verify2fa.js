import express from "express";
import User from "../Models/Login_usuarios.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, codigo } = req.body;

    const user = await User.findOne({ correo: email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    if (!user.twoFactorExpires || user.twoFactorExpires < Date.now()) {
      return res.status(400).json({ message: "Código expirado" });
    }

    if (user.twoFactorCode !== codigo) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    user.twoFactorCode = null;
    user.twoFactorExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Autenticación exitosa",
      token
    });

  } catch (error) {
    console.error("Error en verify-2fa:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
