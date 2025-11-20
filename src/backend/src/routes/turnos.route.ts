import { Router } from "express";
import TurnosController from "../controllers/turnos.controller";
import verifyTokenMiddleware from "../middlewares/verifyToken.middleware";

export const routerTurnos = Router()

routerTurnos.get('/', TurnosController.getAllTurnos)
routerTurnos.get('/mis-turnos', verifyTokenMiddleware, TurnosController.getTurnoByCliente)
routerTurnos.post('/', verifyTokenMiddleware, TurnosController.addTurno)
//Por ahora el cancelar turnos sera por el nombre del cliente hasta que se concete con la base de datos
routerTurnos.delete('/:id', verifyTokenMiddleware, TurnosController.deleteTurno)

export default routerTurnos