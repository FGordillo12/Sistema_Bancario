import express from "express";
import Usuarios from "../Models/usuario.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const router = express.Router();

// Cargar clave privada
let PRIVATE_KEY = null;
const PRIVATE_KEY_PATH = path.join(process.cwd(), "private.pem");
if (fs.existsSync(PRIVATE_KEY_PATH)) {
  PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
} else {
  console.warn("⚠️ private.pem no encontrado. RSA deshabilitado temporalmente");
}

// Obtener cuentas
router.get("/ver-cuentas", async (req, res) => {
  try {
    const todasCuentas = await Usuarios.find(
      { numeroCuenta: { $exists: true } },
      "correo numeroCuenta saldo"
    );
    res.json({
      total: todasCuentas.length,
      cuentas: todasCuentas.map((c) => ({
        correo: c.correo,
        numeroCuenta: c.numeroCuenta,
        saldo: c.saldo,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error obteniendo cuentas", error: error.message });
  }
});

// Consignar
router.post("/consignar", async (req, res) => {
  try {
    const { userId, cuentaDestino, montoEncriptado, concepto } = req.body;

    if (!userId || !cuentaDestino || !montoEncriptado) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // Convertir monto a número
    let monto = parseFloat(montoEncriptado);
    if (isNaN(monto) || monto < 1000)
      return res.status(400).json({ message: "Monto inválido" });

    const usuarioOrigen = await Usuarios.findById(userId);
    const usuarioDestino = await Usuarios.findOne({
      numeroCuenta: cuentaDestino.trim().toUpperCase(),
    });

    if (!usuarioOrigen)
      return res.status(404).json({ message: "Usuario origen no encontrado" });
    if (!usuarioDestino)
      return res.status(404).json({ message: "Cuenta destino no encontrada" });
    if (usuarioOrigen.saldo < monto)
      return res.status(400).json({ message: "Saldo insuficiente" });

    // Actualizar saldos
    usuarioOrigen.saldo -= monto;
    usuarioDestino.saldo += monto;

    // Registrar transacciones
    usuarioOrigen.transacciones.push({
      tipo: "consignacion_envio",
      monto: -monto,
      concepto: concepto || "Consignación",
      cuentaDestino: usuarioDestino.numeroCuenta,
      fecha: new Date(),
    });

    usuarioDestino.transacciones.push({
      tipo: "consignacion_recibo",
      monto,
      concepto: `Consignación de ${usuarioOrigen.correo}`,
      cuentaOrigen: usuarioOrigen.numeroCuenta,
      fecha: new Date(),
    });

    await usuarioOrigen.save();
    await usuarioDestino.save();

    res.json({
      success: true,
      message: "Consignación exitosa",
      nuevoSaldo: usuarioOrigen.saldo,
    });
  } catch (error) {
    console.error("Error en consignación:", error);
    res
      .status(500)
      .json({ message: "Error en la consignación", error: error.message });
  }
});

export default router;
