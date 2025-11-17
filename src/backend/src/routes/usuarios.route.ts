import { Router } from "express";

export const routerUsuarios = Router()
//Authorization
routerUsuarios.post('/auth/register')
routerUsuarios.post('/auth/login')
//Barberos
routerUsuarios.get('/list-barberos')
//Clientes
routerUsuarios.get('/list-clientes')
//Deleteusuario
routerUsuarios.delete('/:id')

export default routerUsuarios