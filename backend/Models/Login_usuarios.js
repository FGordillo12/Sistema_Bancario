import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  contraseña: {
    type: String,
    required: true,
  }
});

export default mongoose.model("usuarios", userSchema);
