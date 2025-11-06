import { Turno } from "./Turno";

export abstract class TurnoFactory{
    abstract crearTurno(cliente:string, barbero:string, fecha:string):Turno
}