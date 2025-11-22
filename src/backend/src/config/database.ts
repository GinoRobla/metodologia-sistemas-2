import mongoose from "mongoose";

export async function connectDB() {
  try {
    mongoose.connect("mongodb://localhost:27017/Peluqueria")
    .then(() => console.log('✅ Conectado a MongoDB'));
  } catch (error) {
    console.error("❌ Error al conectar MongoDB:", error);
  }
}