import { Router } from "express";
import UsuariosController from "../controllers/usuarios.controller";

export const routerUsuarios = Router()
//Authorization
routerUsuarios.post('/auth/register', UsuariosController.addUsuario)
routerUsuarios.post('/auth/login', UsuariosController.login)
//Barberos
routerUsuarios.get('/list-barberos', UsuariosController.getAllBarberos)
//Clientes
routerUsuarios.get('/list-clientes', UsuariosController.getAllClientes)
//Deleteusuario
routerUsuarios.delete('/:id', UsuariosController.deleteUsuario)

export default routerUsuarios