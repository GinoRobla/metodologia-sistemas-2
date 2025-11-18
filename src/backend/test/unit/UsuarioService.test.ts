import { describe, test, it, expect } from 'vitest'
import {UsuarioService} from '../../src/service/UsuarioService'

describe('Funciones de UsuarioService', () => {
    it('addUsuario', () => {
        const svc = new UsuarioService()
        const usu = svc.addUsuario('Pedro', 'none@email.com', '2932-400354', 'pepe2025', 'Barbero')

        expect(usu).toBeDefined()
        expect(svc.getSize()).toBe(1)
    })

    it('getUsuarioByEmail', () => {
        const svc = new UsuarioService()
        svc.addUsuario('Pedro', 'pedro@email.com', '2932-400354', 'pepe2025', 'Barbero')
        svc.addUsuario('Juan', 'juan@email.com', '2932-400874', 'juan2025', 'Cliente')

        expect(svc.getUsuarioByEmail('juan@email.com')?.nombre).toBe('Juan')
        expect(svc.getUsuarioByEmail('juan@email.com')?.tipoUsuario).toBe('Cliente')
    })

    it('deleteUsuario', () => {
        const svc = new UsuarioService()
        svc.addUsuario('Pedro', 'pedro@email.com', '2932-400354', 'pepe2025', 'Barbero')
        svc.addUsuario('Juan', 'juan@email.com', '2932-400874', 'juan2025', 'Cliente')

        const valor = svc.deleteUsuario('pedro@email.com')
        expect(valor).toBe(true)
        expect(svc.getSize()).toBe(1)
     
    })
})