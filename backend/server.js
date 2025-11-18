import express from "express";
import connectDB from "./database.js";

const app = express();
connectDB();

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
