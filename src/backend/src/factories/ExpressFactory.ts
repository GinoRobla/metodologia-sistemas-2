import { Turno } from "./Turno";
import { TurnoFactory } from "./TurnoFactory.abstract";

export class ExpressFactory extends TurnoFactory{
    
    crearTurno(cliente: string, barbero: string, fecha: string, servicios:string): Turno {
        return new Turno(cliente, barbero, fecha, servicios, 20, 900)
    }
    
}