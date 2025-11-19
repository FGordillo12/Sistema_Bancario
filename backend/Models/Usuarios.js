import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  twoFactorCode: { type: String, default: null },
  twoFactorExpires: { type: Date, default: null },
});

export default mongoose.model("Usuarios", usuarioSchema);
