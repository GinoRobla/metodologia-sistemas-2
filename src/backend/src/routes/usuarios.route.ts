import { Router } from "express";
import UsuariosController from "../controllers/usuarios.controller";
import verifyTokenMiddleware from "../middlewares/verifyToken.middleware";

export const routerUsuarios = Router()
//Authorization
routerUsuarios.post('/auth/register', UsuariosController.addUsuario)
routerUsuarios.post('/auth/login', UsuariosController.login)
//Barberos
routerUsuarios.get('/list-barberos', verifyTokenMiddleware ,UsuariosController.getAllBarberos)
//Clientes
routerUsuarios.get('/list-clientes', verifyTokenMiddleware ,UsuariosController.getAllClientes)
//Deleteusuario
routerUsuarios.delete('/:id', verifyTokenMiddleware, UsuariosController.deleteUsuario)

export default routerUsuarios