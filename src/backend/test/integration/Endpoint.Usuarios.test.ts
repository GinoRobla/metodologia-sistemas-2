import request from 'supertest'
import Server from '../../src/app'
import { describe, it, expect} from 'vitest'

describe('Probar los distintos endpoints de la ruta usuarios', () => {
    const server = new Server(3000)
    const app = server.app

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
    })

    it('Endpoints: getAllBarberos', async () => {
        await request(app)
        .post('/api/usuarios/auth/register')
        .send([{
            nombre: "Juan",
            email: "juan@email.com",
            telefono: "2932-40354",
            contraseña: "juan123",
            tipoUsuario: "Barbero"
        }, {
            nombre: "Pedro",
            email: "pedro@email.com",
            telefono: "2932-47894",
            contraseña: "pedro123",
            tipoUsuario: "Barbero"
        }])

        const get = await request(app)
        .get('/api/usuarios/list-barberos')

        expect(get.status).toBe(200)
        expect(get.body[0].contraseña).toBe('juan123')
    })

    it('Endpoints: getAllClientes', async () => {
        await request(app)
        .post('/api/usuarios/auth/register')
        .send([{
            nombre: "Juan",
            email: "juan@email.com",
            telefono: "2932-40354",
            contraseña: "juan123",
            tipoUsuario: "Cliente"
        }, {
            nombre: "Pedro",
            email: "pedro@email.com",
            telefono: "2932-47894",
            contraseña: "pedro123",
            tipoUsuario: "Cliente"
        }])

        const get = await request(app)
        .get('/api/usuarios/list-clientes')

        expect(get.status).toBe(200)
        expect(get.body[0].contraseña).toBe('juan123')
    })
})