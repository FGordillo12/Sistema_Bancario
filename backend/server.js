import express from "express";
import connectDB from "./Conexion/conexion.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

connectDB();

// Importa las rutas
import rutasUsuarios from "./routes/Usuario.js";
app.use("/api", rutasUsuarios);

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");
});
