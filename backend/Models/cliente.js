import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, default: "cliente" } // "cliente" | "admin"
});

export default mongoose.model("Usuarios", clienteSchema);
