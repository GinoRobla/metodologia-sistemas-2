import mongoose, { Document, Schema } from "mongoose";
import { Counter } from "./Counter";

const turnoSchema = new Schema({
    _id: Number,
    cliente: String,
    barbero: String,
    fecha: String,
    tipo: String,
    servicios: String,
    duracion: Number,
    precio: Number
}, {
    timestamps: true
})

turnoSchema.pre("save", async function (next) {
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

export const Turno = mongoose.model("Turno", turnoSchema)