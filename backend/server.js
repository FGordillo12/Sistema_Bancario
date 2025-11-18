import express from "express";
import connectDB from "./Conexion/conexion.js";

const app = express();
connectDB();

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
