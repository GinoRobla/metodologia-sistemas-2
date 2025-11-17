import { z } from 'zod'

export const UsuarioSchema = z.object({
    nombre: z.string(),
    email: z.email(),
    telefono: z.string(),
    contraseña: z.string(),
    tipoUsuario: z.string()
})