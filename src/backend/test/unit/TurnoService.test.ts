import { describe, test, it, expect } from 'vitest'
import { TurnoService } from '../../src/service/TurnoService'
import { Turno } from '../../src/factories/Turno'
import {SimpleTurno} from '../../src/factories/SimpleFactory'
import {ExpressFactory} from '../../src/factories/ExpressFactory'
import {ComboFactory} from '../../src/factories/ComboFactory'

describe('Funciones de turnoService', () => {
    it('addTurno', () => {
        const simple = new SimpleTurno()
        const svc = new TurnoService()
        const turno = svc.addTurno(simple.crearTurno('Perez', 'Agustin', '10/10/10', 'Corte'))
        expect(turno).toBeDefined()
        expect(svc.getSize()).toBe(1)
    })
    it('getTurnoByCliente', () => {
        const express = new ExpressFactory()
        const svc = new TurnoService()
        const turno = svc.addTurno(express.crearTurno('Perez', 'Agustin', '10/10/10', 'Barba'))

        expect(svc.getTurnoByCliente('Perez')[0].barbero).toBe('Agustin')
        expect(svc.getTurnoByCliente('Perez').length).toBe(1)
    })
})