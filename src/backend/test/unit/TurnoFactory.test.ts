import {describe, test, it, expect} from 'vitest'

import {SimpleTurno} from '../../src/factories/SimpleFactory'
import {ExpressFactory} from '../../src/factories/ExpressFactory'
import {ComboFactory} from '../../src/factories/ComboFactory'

describe('testear que las funciones de las clases devuelvan un turno segun el tipo', () => {
    it('Turno Simple', () => {
        const factory = new SimpleTurno()
        const turno = factory.crearTurno('Mateo', 'Agustin', '10/08/2005', 'Corte')

        expect(turno.servicios).toBe('Corte')
        expect(turno.duracion).toBe(30)
        expect(turno.precio).toBe(500)
    })

    it('Turno Express', () => {
        const factory = new ExpressFactory()
        const turno = factory.crearTurno('Mateo', 'Agustin', '10/08/2005', 'Corte')

        expect(turno.servicios).toBe('Corte')
        expect(turno.duracion).toBe(20)
        expect(turno.precio).toBe(900)
    })

    it('Turno Combo', () => {
        const factory = new ComboFactory()
        const turno = factory.crearTurno('Mateo', 'Agustin', '10/08/2005')

        expect(turno.servicios).toBe('Corte-Barba')
        expect(turno.duracion).toBe(45)
        expect(turno.precio).toBe(700)
    })
})