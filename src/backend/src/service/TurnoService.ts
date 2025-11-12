import fa from "zod/v4/locales/fa.js";
import { Turno } from "../factories/Turno";
import th from "zod/v4/locales/th.js";

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
    getTurnoByCliente(clienteName:string): Turno[] | [] {
        const listTurnos = this.turnosList.filter(t => t.cliente === clienteName)
        return listTurnos
    }

    //Crear Turno
    addTurno(turnoNew:Turno): Turno{
        this.turnosList.push(turnoNew)
        return turnoNew
    }

    //Cancelar Turno
    deleteTurno(clienteName:string): boolean{
        const idx = this.turnosList.findIndex(t => t.cliente === clienteName)
        if(idx === -1) return false
        this.turnosList.splice(idx, 1)
        return true
    }
}