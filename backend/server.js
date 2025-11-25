import express from "express";
import connectDB from "./Conexion/conexion.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Rutas
import rutasUsuarios from "./routes/route.usuario.js";
import rutasLogin from "./routes/route.login.js";
import rutasVerify2FA from "./routes/verify2fa.js";
import rutasCliente from "./routes/route.crearCliente.js";
import rutasProductoBancario from "./routes/route.productoBancario.js";
import rutasTransacciones from "./routes/route.transacciones.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fastidious-mochi-a0d711.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Permitir preflight en todas las rutas
app.options('*', cors());

app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas
app.use("/apis", rutasLogin); // login + 2FA
app.use("/api", rutasUsuarios); // usuarios
app.use("/api/verify-2fa", rutasVerify2FA); // verificación 2FA
app.use("/api/cliente", rutasCliente); // crear cliente
app.use("/api/productos-bancarios", rutasProductoBancario); // productos bancarios
app.use("/api/transacciones", rutasTransacciones); // transacciones

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
      "/api/productos-bancarios",
      "/api/transacciones",
    ],
  });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log("Rutas disponibles:");
  console.log("- /apis/login");
  console.log("- /api/usuarios");
  console.log("- /api/verify-2fa");
  console.log("- /api/cliente");
  console.log("- /api/productos-bancarios");
  console.log("- /api/transacciones");
  console.log("- /api/test-server (para pruebas)");
});
