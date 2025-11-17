import { Turno } from "../models/Turno";

export abstract class TurnoFactory{
    abstract crearTurno(cliente:string, barbero:string, fecha:string, servicios:string):Turno
}