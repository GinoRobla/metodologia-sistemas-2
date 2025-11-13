import { TurnoService } from "../service/TurnoService";
import { Request, Response } from "express";
const svc = new TurnoService()

export class TurnosController {
    public async getAllTurnos(req:Request, res:Response) {
        try{
            const turnos = svc.getTurnoList()
            res.status(200).json(turnos)
        }catch{
            res.status(401).json({error: 'Error al obtener los datos'})
        }
    }

    public async getTurnoByCliente(req:Request, res:Response){

    }

    public async addTurno(req:Request, res:Response){

    }

    public async deleteTurno(req:Request, res:Response){

    }
}

export default new TurnosController