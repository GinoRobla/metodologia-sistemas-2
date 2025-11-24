import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import request from 'supertest'
import Server from '../../src/app'
import { describe, it, expect, beforeAll} from 'vitest'
import { connectDB } from '../../src/config/database'

describe('Probar los distintos endpoints de la ruta usuarios', () => {
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
                nombre: "AdminTest",
                email: "admin@email.com",
                telefono: "123456789",
                contraseña: "admin123",
                tipoUsuario: "Cliente"
            })

        // Hacer login para obtener el token
        const loginRes = await request(app)
            .post('/api/usuarios/auth/login')
            .send({
                email: "admin@email.com",
                contraseña: "admin123"
            })

        token = loginRes.body || ''
    }, 30000)

    it('Endpoint: addUsuario', async () => {
        const res = await request(app)
        .post('/api/usuarios/auth/register')
        .send({
            nombre: "Juan",
            email: "juan@email.com",
            telefono: "2932-40354",
            contraseña: "juan123",
            tipoUsuario: "Barbero"
        })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('nombre')
    }, 15000)

    it('Endpoints: getAllBarberos', async () => {
        await request(app)
        .post('/api/usuarios/auth/register')
        .send({
            nombre: "Juan2",
            email: "juan2@email.com",
            telefono: "2932-40354",
            contraseña: "juan123",
            tipoUsuario: "Barbero"
        })

        const get = await request(app)
        .get('/api/usuarios/list-barberos')
        .set('Authorization', token)

        expect(get.status).toBe(200)
        expect(get.body.length).toBeGreaterThan(0)
    }, 15000)

    it('Endpoints: getAllClientes', async () => {
        await request(app)
        .post('/api/usuarios/auth/register')
        .send({
            nombre: "Cliente1",
            email: "cliente1@email.com",
            telefono: "2932-40354",
            contraseña: "cliente123",
            tipoUsuario: "Cliente"
        })

        const get = await request(app)
        .get('/api/usuarios/list-clientes')
        .set('Authorization', token)

        expect(get.status).toBe(200)
        expect(get.body.length).toBeGreaterThan(0)
    }, 15000)
})