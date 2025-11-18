import Usuario from "./Models/Usuario.js";
import cors from "cors";

app.use(cors());
app.use(express.json()); // Para leer JSON del frontend

// Ruta para registrar usuarios
app.post("/registro", async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña
    });

    await nuevoUsuario.save();
    res.json({ mensaje: "Usuario registrado exitosamente" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hubo un problema al registrar el usuario" });
  }
});
