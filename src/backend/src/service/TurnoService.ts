import { Turno } from "../factories/Turno";

export class TurnoService {

    private turnosList:Turno[] = []
    private id_autoincremental:number = 1

    constructor(){}

    getSize():number{
        return this.turnosList.length
    }

    getTurnoList(): Turno[]{
        throw new Error('Implemtar funcion')
    }

    getTurnoById(): Turno | undefined{
        throw new Error('Implemtar funcion')
    }

    //Obtener turnos segun el cliente
    getTurnoByCliente(): Turno[] | Turno | undefined{
        throw new Error('Implemtar funcion')
    }

    //Crear Turno
    addTurno(turnoNew:Turno): Turno{
        this.turnosList.push(turnoNew)
        return turnoNew
    }

    //Cancelar Turno
    deleteTurno(id:number): boolean{
        throw new Error('Implemtar funcion')
    }
}