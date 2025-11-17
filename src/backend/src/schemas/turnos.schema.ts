import { z } from 'zod'

export const TurnoSchema = z.object({
    cliente: z.string(),
    barbero: z.string(),
    fecha: z.string(),
    servicios: z.string().optional(),
    tipo: z.string()
})