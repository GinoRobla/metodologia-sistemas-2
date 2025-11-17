import request from 'supertest'
import Server from '../../src/app'
import { describe, it, expect} from 'vitest'

describe('Porbar los distintos endpoints de la ruta Turnos', () => {
    const server = new Server(3000)
    const app = server.app

    it('Endpoint: addTurno', async () => {
        const res = await request(app)
        .post('/api/turnos')
        .send({
            cliente: 'Perez',
            barbero: 'Agustin',
            fecha: '10/10/10',
            servicios: 'Corte',
            tipo: 'Simple'
        })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('cliente')
    })
})