import express from "express";
import connectDB from "./Conexion/conexion.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Rutas
import rutasUsuarios from "./routes/route.usuario.js";
import rutasLogin from "./routes/route.login.js";
import rutasVerify2FA from "./routes/verify2fa.js";
import rutasCliente from "./routes/route.crear_cliente.js";
import rutasTransacciones from "./routes/route.transacciones.js"; // NUEVA IMPORTACIÓN

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Conectar a MongoDB
connectDB();

// Usar rutas
app.use("/apis", rutasLogin); // login + 2FA inicio
app.use("/api", rutasUsuarios); // usuarios
app.use("/api/verify-2fa", rutasVerify2FA); // verificacion de codigo 2FA
app.use("/api/cliente", rutasCliente); // rutas para crear cliente
app.use("/api/transacciones", rutasTransacciones); // NUEVA RUTA PARA TRANSACCIONES

// Ruta de prueba temporal
app.get("/api/test-server", (req, res) => {
  res.json({ 
    message: "✅ Servidor funcionando correctamente",
    timestamp: new Date(),
    routes: [
      "/apis/login",
      "/api/usuarios", 
      "/api/verify-2fa",
      "/api/cliente",
      "/api/transacciones"
    ]
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
  console.log("Rutas disponibles:");
  console.log("- /apis/login");
  console.log("- /api/usuarios");
  console.log("- /api/verify-2fa"); 
  console.log("- /api/cliente");
  console.log("- /api/transacciones");
  console.log("- /api/test-server (para pruebas)");
});