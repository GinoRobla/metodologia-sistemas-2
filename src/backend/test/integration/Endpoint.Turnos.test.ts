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

    it('Endpoint: getAllTurnos', async () => {
        const res = await request(app)
        .post('/api/turnos')
        .send([{
            cliente: 'Perez',
            barbero: 'Agustin',
            fecha: '10/10/10',
            servicios: 'Corte',
            tipo: 'Simple'
        }, {
            cliente: 'Checho',
            barbero: 'Pedro',
            fecha: '12/10/19',
            servicios: 'Corte',
            tipo: 'Combo'
        }])
        const get = await request(app)
        .get('/api/turnos')

        expect(get.status).toBe(200)
        expect(get.body[0].barbero).toBe('Agustin')
    })
})