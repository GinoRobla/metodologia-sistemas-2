import { ExpressFactory } from "../factories/ExpressFactory";
import { ComboFactory } from "../factories/ComboFactory";
import { SimpleTurno } from "../factories/SimpleFactory";
import { TurnoSchema } from "../schemas/turnos.schema";
import { Turno } from "../models/Turno";
import { Usuario } from "../models/Usuario";
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
            const {tipo, cliente, barbero, fecha, servicios} = req.body

            // Validación 1: Fecha no puede ser en el pasado
            const fechaSeleccionada = new Date(fecha)
            const ahora = new Date()
            if(fechaSeleccionada < ahora){
                return res.status(400).json({ error: 'No puedes reservar un turno en el pasado' })
            }

            // Validación 2: Horario de atención (Lunes a Sábado, 9:00 - 20:00)
            const diaSemana = fechaSeleccionada.getDay()
            const hora = fechaSeleccionada.getHours()

            if(diaSemana === 0){
                return res.status(400).json({ error: 'La peluquería no atiende los domingos' })
            }

            if(hora < 9 || hora >= 20){
                return res.status(400).json({ error: 'El horario de atención es de 9:00 a 20:00' })
            }

            // Validación 3: Verificar que el barbero existe
            const barberoExiste = await Usuario.findOne({ nombre: barbero, tipoUsuario: 'Barbero' })
            if(!barberoExiste){
                return res.status(404).json({ error: 'El barbero seleccionado no existe' })
            }

            // Validación 4: Verificar disponibilidad del barbero
            const turnosExistentes = await Turno.find({ barbero: barbero })

            for(const turnoExistente of turnosExistentes){
                if(!turnoExistente.fecha) continue

                const fechaTurno = new Date(turnoExistente.fecha as string)
                const duracionTurno = turnoExistente.duracion || 60
                const finTurno = new Date(fechaTurno.getTime() + duracionTurno * 60000)

                // Calcular duración del nuevo turno
                let duracionNuevo = 60
                if(tipo === 'Combo') duracionNuevo = 90
                if(tipo === 'Express') duracionNuevo = 30

                const finNuevo = new Date(fechaSeleccionada.getTime() + duracionNuevo * 60000)

                // Verificar solapamiento
                const haySolapamiento = (
                    (fechaSeleccionada >= fechaTurno && fechaSeleccionada < finTurno) ||
                    (finNuevo > fechaTurno && finNuevo <= finTurno) ||
                    (fechaSeleccionada <= fechaTurno && finNuevo >= finTurno)
                )

                if(haySolapamiento){
                    return res.status(409).json({
                        error: `El barbero ${barbero} ya tiene un turno a esa hora. Por favor elige otro horario.`
                    })
                }
            }

            // Si pasa todas las validaciones, crear el turno
            let factory
            let turno
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
                tipo: tipo,
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