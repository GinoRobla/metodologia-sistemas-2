import { ExpressFactory } from "../factories/ExpressFactory";
import { ComboFactory } from "../factories/ComboFactory";
import { SimpleTurno } from "../factories/SimpleFactory";
import { TurnoSchema } from "../schemas/turnos.schema";
import { Turno } from "../models/Turno";
import { Request, Response } from "express";

export class TurnosController {
    public async getAllTurnos(req:Request, res:Response) {
        try{
            const turnos = await Turno.find()
            return res.status(200).json(turnos)
        }catch{
            return res.status(401).json({error: 'Error al obtener los datos'})
        }
    }

    public async getTurnoByCliente(req:Request, res:Response){
        try{
            const {cliente} = req.body
            const turno = await Turno.find({cliente: cliente})
            if(turno.length === 0){
                return res.status(404).json({error: 'El cliente no tiene ningun turno agendado'})
            }
            return res.status(200).json(turno)
        }catch{
            return res.status(401).json({error: 'Error al obtener los datos'})
        }
    }

    public async addTurno(req:Request, res:Response){
        const parse = TurnoSchema.safeParse(req.body)
        if(!parse.success){
            return res.status(400).json({ error: 'validationError', detail: 'Faltan datos' })
        }
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
            const turnoNew = new Turno({
                cliente: turno.cliente,
                barbero: turno.barbero,
                fecha: turno.fecha,
                servicios: turno.servicios,
                duracion: turno.duracion,
                precio: turno.precio
            })

            await turnoNew.save()
            
            return res.status(201).json(turnoNew)

        }catch{
            return res.status(400).json({error: 'Error al crear el turno'})
        }
    }

    public async deleteTurno(req:Request, res:Response){
        try{
            const id = req.params.id

            await Turno.deleteOne({_id: id})
            .then(() => {return res.status(204).json({})})
            .catch(() => {return res.status(404).json({error: 'No existe un turno con ese ID'})})
        }catch{
            return res.status(400).json({error: 'Error al cancelar el turno'})
        }
    }
}

export default new TurnosController