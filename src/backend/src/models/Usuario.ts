import mongoose, { Document, Schema } from "mongoose";
import { Counter } from "./Counter";

const usuarioSchema = new Schema({
    _id: Number,
    nombre: String,
    email: String,
    telefono: String,
    contraseña: String,
    tipoUsuario: String
}, {
    timestamps: true
})

usuarioSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "turnoId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this._id = counter!.seq;
  }
  next();
});

export const Usuario = mongoose.model("Usuario", usuarioSchema)