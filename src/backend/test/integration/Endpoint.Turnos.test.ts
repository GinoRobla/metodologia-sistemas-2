import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import request from 'supertest'
import Server from '../../src/app'
import { describe, it, expect, beforeAll, afterEach} from 'vitest'
import { connectDB } from '../../src/config/database'
import { Turno } from '../../src/models/Turno'

describe('Porbar los distintos endpoints de la ruta Turnos', () => {
    const server = new Server(3000)
    const app = server.app
    let token = ''

    beforeAll(async () => {
        // Conectar a la base de datos
        await connectDB()

        // Registrar un usuario
        await request(app)
            .post('/api/usuarios/auth/register')
            .send({
                nombre: "TestUser",
                email: "test@email.com",
                telefono: "123456789",
                contraseña: "test123",
                tipoUsuario: "Cliente"
            })

        // Hacer login para obtener el token
        const loginRes = await request(app)
            .post('/api/usuarios/auth/login')
            .send({
                email: "test@email.com",
                contraseña: "test123"
            })

        token = loginRes.body || ''

        // Crear barberos para los tests
        await request(app)
            .post('/api/usuarios/auth/register')
            .send({
                nombre: "Agustin",
                email: "agustin@email.com",
                telefono: "123456789",
                contraseña: "agustin123",
                tipoUsuario: "Barbero"
            })

        await request(app)
            .post('/api/usuarios/auth/register')
            .send({
                nombre: "Pedro",
                email: "pedro@email.com",
                telefono: "123456789",
                contraseña: "pedro123",
                tipoUsuario: "Barbero"
            })

        // Limpiar turnos de prueba antes de empezar
        await Turno.deleteMany({ cliente: 'Perez' })
    }, 30000)

    afterEach(async () => {
        // Limpiar turnos de prueba después de cada test
        await Turno.deleteMany({ cliente: 'Perez' })
    })

    it('Endpoint: addTurno', async () => {
        const res = await request(app)
        .post('/api/turnos')
        .set('Authorization', token)
        .send({
            cliente: 'Perez',
            barbero: 'Agustin',
            fecha: '2030-10-10T10:00:00',
            servicios: 'Corte',
            tipo: 'Simple'
        })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('cliente')
    }, 15000)

    it('Endpoint: getAllTurnos', async () => {
        const res = await request(app)
        .post('/api/turnos')
        .set('Authorization', token)
        .send({
            cliente: 'Perez',
            barbero: 'Agustin',
            fecha: '2030-10-10T10:00:00',
            servicios: 'Corte',
            tipo: 'Simple'
        })

        const get = await request(app)
        .get('/api/turnos')

        expect(get.status).toBe(200)
        expect(get.body.length).toBeGreaterThan(0)
    }, 15000)

    it('Endpoint: getTurnoByCliente', async () => {
        const res = await request(app)
        .post('/api/turnos')
        .set('Authorization', token)
        .send({
            cliente: 'Perez',
            barbero: 'Agustin',
            fecha: '2030-10-10T10:00:00',
            servicios: 'Corte',
            tipo: 'Simple'
        })

        const get = await request(app)
        .post('/api/turnos/mis-turnos')
        .set('Authorization', token)
        .send({
            cliente:'Perez'
        })

        expect(get.status).toBe(200)
        expect(get.body[0].barbero).toBe('Agustin')
    }, 15000)
})