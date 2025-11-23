import mongoose from "mongoose";

const URL_PORT = process.env.URL_DATABASE

export async function connectDB() {
  try {
    mongoose.connect(URL_PORT)
    .then(() => console.log('✅ Conectado a MongoDB'));
  } catch (error) {
    console.error("❌ Error al conectar MongoDB:", error);
  }
}