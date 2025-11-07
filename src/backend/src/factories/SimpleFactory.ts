import { Turno } from "./Turno";
import { TurnoFactory } from "./TurnoFactory.abstract";

export class SimpleTurno extends TurnoFactory{
    
    crearTurno(cliente: string, barbero: string, fecha: string, servicios:string): Turno {
        return new Turno(cliente, barbero, fecha, servicios, 30, 500)
    }
    
}