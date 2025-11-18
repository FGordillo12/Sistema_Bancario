import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Conexión a MongoDB exitosa!");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  }
}

export default connectDB;
