import { TurnoService } from "../service/TurnoService";
import { ExpressFactory } from "../factories/ExpressFactory";
import { ComboFactory } from "../factories/ComboFactory";
import { SimpleTurno } from "../factories/SimpleFactory";
import { Request, Response } from "express";
import { Turno } from "../factories/Turno";

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
        try{
            const {cliente} = req.body
            const turno = svc.getTurnoByCliente(cliente)
            if(turno.length === 0){
                res.status(404).json({error: 'El cliente no tiene ningun turno agendado'})
            }
            res.status(200).json(turno)
        }catch{
            res.status(401).json({error: 'Error al obtener los datos'})
        }
    }

    public async addTurno(req:Request, res:Response){
        try{
            let factory
            let turno
            const {tipo} = req.body
            const {cliente, barbero, fecha, servicios} = req.body
            switch (tipo){
                case 'Simple':
                    factory = new SimpleTurno()
                    turno = factory.crearTurno(cliente, barbero, fecha, servicios)
                    break
                case 'Combo':
                    factory = new ComboFactory()
                    turno = factory.crearTurno(cliente, barbero, fecha)
                    break
                case 'Express':
                    factory = new ExpressFactory()
                    turno = factory.crearTurno(cliente, barbero, fecha, servicios)
                    break
            }
            if(!turno){
                throw new Error('No existe el tipo de turno que seleccionaste')
            }
            const turnoNew = svc.addTurno(turno)
            res.status(201).json(turnoNew)

        }catch{
            res.status(400).json({error: 'Error al crear el turno'})
        }
    }

    public async deleteTurno(req:Request, res:Response){
        try{
            const {cliente} = req.body
            const success = svc.deleteTurno(cliente)
            if(success){
                res.status(204).json({})
            }else{
                res.status(404).json({error: 'No se encontro ningun turno con ese nombre de cliente'})
            }
        }catch{
            res.status(400).json({error: 'Error al cancelar el turno'})
        }
    }
}

export default new TurnosController