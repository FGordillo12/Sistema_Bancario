import express from "express";
import connectDB from "./Conexion/conexion.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import rutasUsuarios from "./routes/route.usuario.js";
import rutasLogin from "./routes/route.login.js";
import rutasVerify2FA from "./routes/verify2fa.js";
import rutasCliente from "./routes/route.crearCliente.js";
import rutasProductoBancario from "./routes/route.productoBancario.js";
import rutasTransacciones from "./routes/route.transacciones.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

connectDB();

app.use("/apis", rutasLogin);
app.use("/api", rutasUsuarios);
app.use("/api/verify-2fa", rutasVerify2FA);
app.use("/api/cliente", rutasCliente);
app.use("/api/productos-bancarios", rutasProductoBancario);
app.use("/api/transacciones", rutasTransacciones);

app.get("/api/test-server", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente" });
});

app.use((req, res) => res.status(404).json({ message: "Ruta no encontrada" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
