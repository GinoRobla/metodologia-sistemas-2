import { Turno } from "../factories/Turno";

export class TurnoService {

    private static instance: TurnoService;
    private turnosList:Turno[] = []

    private constructor(){}

    public static getInstance(): TurnoService {
        if (!TurnoService.instance) {
            TurnoService.instance = new TurnoService();
        }
        return TurnoService.instance;
    }

    public static resetInstance(): void {
        TurnoService.instance = new TurnoService();
    }

    getSize():number{
        return this.turnosList.length
    }

    getTurnoList(): Turno[]{
        return this.turnosList
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