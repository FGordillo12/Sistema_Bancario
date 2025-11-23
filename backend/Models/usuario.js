import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, enum: ["admin", "cliente"], default: "cliente" },
  twoFactorCode: { type: String, default: null },
  twoFactorExpires: { type: Date, default: null },
});


export default mongoose.model("Usuarios", usuarioSchema);
