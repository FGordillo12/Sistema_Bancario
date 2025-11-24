import express from "express";
import Producto from "../Models/productoBancario.js";
import Usuario from "../Models/usuario.js";

const router = express.Router();

// Crear producto para un cliente (solo admin)
router.post("/", async (req, res) => {
  try {
    const { correo, tipo } = req.body;

    // Validar tipo de producto
    const tiposValidos = ["Ahorros", "Corriente", "CDT"];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ message: "Tipo de producto inválido" });
    }

    // Buscar cliente por correo
    const cliente = await Usuario.findOne({ correo });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Crear producto asociado al cliente
    const producto = new Producto({
      clienteId: cliente._id,
      tipo,
    });

    await producto.save();

    res.status(201).json(producto); // devolver 201 al crear
  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

/**
 * Obtener productos de un cliente por correo
 */
router.get("/cliente/:correo", async (req, res) => {
  try {
    const { correo } = req.params;

    // Buscar cliente
    const cliente = await Usuario.findOne({ correo });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Obtener productos asociados
    const productos = await Producto.find({ clienteId: cliente._id }).populate(
      "clienteId",
      "nombre correo"
    );

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

/**
 * Eliminar producto por ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar y eliminar
    const producto = await Producto.findByIdAndDelete(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    res.status(500).json({ message: "Error eliminando producto" });
  }
});

export default router;
