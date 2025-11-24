import { defineConfig } from 'vitest/config'
import * as dotenv from 'dotenv'

// Cargar variables de entorno del archivo .env
dotenv.config()

export default defineConfig({
  test: {
    globals: true,
    // Configurar variables de entorno para los tests
    env: {
      URL_DATABASE: process.env.URL_DATABASE || '',
      PORT: process.env.PORT || '3000',
      PASSWORD_JWT: process.env.PASSWORD_JWT || ''
    },
    // Timeout para tests individuales (15 segundos)
    testTimeout: 15000,
    // Timeout para hooks como beforeAll (60 segundos)
    hookTimeout: 60000,
  }
})
