import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://SanCode:bo289G5MecjqSQsr@cluster0.tsmwijl.mongodb.net/?appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Conexión a MongoDB exitosa!");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  }
}

export default connectDB;
