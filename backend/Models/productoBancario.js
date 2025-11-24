import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuarios",
    required: true,
  },
  tipo: {
    type: String,
    enum: ["Ahorros", "Corriente", "CDT"],
    required: true,
  },
  numeroCuenta: {
    type: String,
    unique: true,
    required: true,
  },
  saldo: {
    type: Number,
    default: 0,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  activo: {
    type: Boolean,
    default: true,
  },
});

// Función para generar número de cuenta automático antes de guardar
productoSchema.pre("validate", function (next) {
  if (!this.numeroCuenta) {
    this.numeroCuenta = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
  }
  next();
});

export default mongoose.model("Producto", productoSchema);
