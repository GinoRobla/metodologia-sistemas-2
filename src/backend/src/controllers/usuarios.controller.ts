import { Request, Response } from "express";
import { UsuarioService } from "../service/UsuarioService";
import { UsuarioSchema } from "../schemas/usuarios.schema";

const svc = new UsuarioService()

export class UsuariosController {
    
    public async login(req:Request, res:Response) {
        
    }

    public async getAllBarberos(req:Request, res:Response) {
        try{
            const usuarios = svc.getAllBarberos()
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
            const usuarios = svc.getAllClientes()
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
            const usuario = svc.addUsuario(nombre, email, telefono, contraseña, tipoUsuario)
            return res.status(201).json(usuario)
        }catch{
            return res.status(401).json({error: 'Error al obtener los datos'})
        }
    }

    public async deleteUsuario(req:Request, res:Response){
        try{
            const { email } = req.body
            const success = svc.deleteUsuario(email)
            if(!success){
                return res.status(404).json({error: 'No se encontro ningun turno con ese nombre de cliente'})
            }
            return res.status(204).json({})
        }catch{
            return res.status(401).json({error: 'Error al obtener los datos'})
        }
    }
}

export default new UsuariosController