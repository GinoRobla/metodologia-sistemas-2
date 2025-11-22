import { Request, Response } from "express";
import { UsuarioSchema } from "../schemas/usuarios.schema";
import { Usuario } from "../models/Usuario";
import jwt from "jsonwebtoken";

export class UsuariosController {
    
    public async login(req:Request, res:Response) {
        try{
            const {email, contraseña} = req.body
            const usuFound = await Usuario.findOne({email: email})

            if(!usuFound || !usuFound.contraseña){
                throw new Error('Contraseña o Email incorrecto')
            }

            if(usuFound.contraseña !== contraseña){
                throw new Error('Contraseña incorrecto')
            }

            const payload = {
                userName: usuFound.nombre,
                userEmail: usuFound.email,
                tipoUsuario: usuFound.tipoUsuario
            }

            const token = jwt.sign(
                        //ENV
                payload, 'palabraSecreta',
                {
                    expiresIn: '24h',
                }
            )

            return res.status(200).json(token)

        }catch{
            res.status(401).json({message: 'Error de password o email'})
        }
    }

    public async getAllBarberos(req:Request, res:Response) {
        try{
            const usuarios = await Usuario.find({tipoUsuario: "Barbero"})
            if(usuarios.length === 0){
                return res.status(404).json({error: 'No hay barberos registrados'})
            }
            return res.status(200).json(usuarios)
        }catch{
            return res.status(401).json({error: 'Error al obtener los datos'})
        }
    }

    public async getAllClientes(req:Request, res:Response){
        try{
            const usuarios = await Usuario.find({tipoUsuario: 'Cliente'})
            if(usuarios.length === 0){
                return res.status(404).json({error: 'No hay clientes registrados'})
            }
            return res.status(200).json(usuarios)
        }catch{
            return res.status(401).json({error: 'Error al obtener los datos'})
        }
    }

    public async addUsuario(req:Request, res:Response){
        const parse = UsuarioSchema.safeParse(req.body)
        if(!parse.success){
            return res.status(400).json({ error: 'validationError', detail: 'Faltan datos' })
        }
        try{
            const {nombre, email, telefono, contraseña, tipoUsuario} = req.body
            const usuarioNew = new Usuario({
                nombre: nombre,
                email: email,
                telefono: telefono,
                contraseña: contraseña,
                tipoUsuario: tipoUsuario
            })

            await usuarioNew.save()

            return res.status(201).json(usuarioNew)
        }catch{
            return res.status(401).json({error: 'Error al obtener los datos'})
        }
    }

    public async deleteUsuario(req:Request, res:Response){
        try{
            const id = req.params.id
            await Usuario.deleteOne({_id: id})
            .then(() => {return res.status(204).json({})})
            .catch(() => {return res.status(404).json({error: 'No existe un turno con ese ID'})})
        }catch{
            return res.status(401).json({error: 'Error al obtener los datos'})
        }
    }
}

export default new UsuariosController