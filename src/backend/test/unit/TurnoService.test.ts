import { describe, test, it, expect, beforeEach } from 'vitest'
import { TurnoService } from '../../src/service/TurnoService'
import {SimpleTurno} from '../../src/factories/SimpleFactory'
import {ExpressFactory} from '../../src/factories/ExpressFactory'
import {ComboFactory} from '../../src/factories/ComboFactory'

describe('Funciones de turnoService', () => {
    beforeEach(() => {
        TurnoService.resetInstance()
    })

    it('addTurno', () => {
        const simple = new SimpleTurno()
        const svc = TurnoService.getInstance()
        const turno = svc.addTurno(simple.crearTurno('Perez', 'Agustin', '10/10/10', 'Corte'))
        expect(turno).toBeDefined()
        expect(svc.getSize()).toBe(1)
    })
    it('getTurnoByCliente', () => {
        const express = new ExpressFactory()
        const svc = TurnoService.getInstance()
        const turno = svc.addTurno(express.crearTurno('Perez', 'Agustin', '10/10/10', 'Barba'))

        expect(svc.getTurnoByCliente('Perez')[0].barbero).toBe('Agustin')
        expect(svc.getTurnoByCliente('Perez').length).toBe(1)
    })
    it('deletePiloto', () => {
        const express = new ExpressFactory()
        const combo = new ComboFactory()
        const simple = new SimpleTurno()
        const svc = TurnoService.getInstance()
        const turno1 = svc.addTurno(express.crearTurno('Perez', 'Agustin', '10/10/10', 'Barba'))
        const turno2 = svc.addTurno(combo.crearTurno('Matias', 'Agustin', '10/10/10'))
        const turno3 = svc.addTurno(simple.crearTurno('Joaquin', 'Agustin', '10/10/10', 'Corte'))

        const valor = svc.deleteTurno(turno2.cliente)

        expect(valor).toBe(true)
        expect(svc.getSize()).toBe(2)
        expect(svc.getTurnoByCliente('Matias')).toStrictEqual([])
    })
})