import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, enum: ["admin", "cliente"], default: "cliente" },
  twoFactorCode: { type: String, default: null },
  twoFactorExpires: { type: Date, default: null },


  //OPCIONES PARA LAS TRASNSCCIONES
  saldo: { type: Number, default: 0 },
  numeroCuenta: { type: String, unique: true, sparse: true },
  transacciones: [{
    tipo: { type: String, enum: ['recarga', 'retiro', 'consignacion_envio', 'consignacion_recibo'] },
    monto: Number,
    fecha: { type: Date, default: Date.now },
    concepto: String,
    metodoPago: String,
    cuentaDestino: String,
    cuentaOrigen: String
  }]
});


export default mongoose.model("Usuarios", usuarioSchema);
