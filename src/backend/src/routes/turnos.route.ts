import { Router } from "express";
import TurnosController from "../controllers/turnos.controller";

export const routerTurnos = Router()

routerTurnos.get('/', TurnosController.getAllTurnos)
routerTurnos.get('/mis-turnos', TurnosController.getTurnoByCliente)
routerTurnos.post('/', TurnosController.addTurno)
//Por ahora el cancelar turnos sera por el nombre del cliente hasta que se concete con la base de datos
routerTurnos.delete('/:id', TurnosController.deleteTurno)

module.exports = routerTurnos;