import { Turno } from "./Turno";
import { TurnoFactory } from "./TurnoFactory.abstract";

export class ExpressFactory extends TurnoFactory{
    
    crearTurno(cliente: string, barbero: string, fecha: string): Turno {
        return new Turno(cliente, barbero, fecha, ['Corte'], 20, 900)
    }
    
}