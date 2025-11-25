import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Usuario } from './models/Usuario';
import { Turno } from './models/Turno';
import { Counter } from './models/Counter';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.URL_DATABASE || 'mongodb://localhost:27017/barberia';

// Datos de prueba
const usuariosData = [
    // Barbero
    {
        nombre: 'Carlos Martinez',
        email: 'barbero@test.com',
        telefono: '2932-123456',
        contraseña: '123456',
        tipoUsuario: 'Barbero'
    },
    // Cliente
    {
        nombre: 'Juan Perez',
        email: 'cliente@test.com',
        telefono: '2932-456789',
        contraseña: '123456',
        tipoUsuario: 'Cliente'
    }
];

const turnosData = [
    // Turno de ejemplo
    {
        cliente: 'Juan Perez',
        barbero: 'Carlos Martinez',
        tipo: 'Combo',
        servicios: 'Corte-Barba',
        duracion: 45,
        precio: 700,
        diasOffset: 1, // Mañana
        horaOffset: 2
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Iniciando seed de la base de datos...');

        // Conectar a MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // Limpiar colecciones existentes
        console.log('🗑️  Limpiando colecciones...');
        await Usuario.deleteMany({});
        await Turno.deleteMany({});
        await Counter.deleteMany({});
        console.log('✅ Colecciones limpiadas');

        // Crear usuarios
        console.log('👥 Creando usuarios...');
        for (const userData of usuariosData) {
            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(userData.contraseña, 10);

            const usuario = new Usuario({
                nombre: userData.nombre,
                email: userData.email,
                telefono: userData.telefono,
                contraseña: hashedPassword,
                tipoUsuario: userData.tipoUsuario
            });

            await usuario.save();
            console.log(`  ✓ ${userData.tipoUsuario}: ${userData.nombre} (${userData.email})`);
        }

        console.log('✅ Usuarios creados exitosamente');

        // Crear turnos
        console.log('📅 Creando turnos...');
        for (const turnoData of turnosData) {
            const now = new Date();

            // Calcular fecha del turno
            const fechaTurno = new Date(now);
            if (turnoData.diasOffset) {
                fechaTurno.setDate(fechaTurno.getDate() + turnoData.diasOffset);
            }
            fechaTurno.setHours(now.getHours() + turnoData.horaOffset, 0, 0, 0);

            const turno = new Turno({
                cliente: turnoData.cliente,
                barbero: turnoData.barbero,
                fecha: fechaTurno.toISOString(),
                tipo: turnoData.tipo,
                servicios: turnoData.servicios,
                duracion: turnoData.duracion,
                precio: turnoData.precio
            });

            await turno.save();
            console.log(`  ✓ ${turnoData.tipo} - ${turnoData.cliente} con ${turnoData.barbero}`);
        }

        console.log('✅ Turnos creados exitosamente');

        // Resumen
        const totalUsuarios = await Usuario.countDocuments();
        const totalBarberos = await Usuario.countDocuments({ tipoUsuario: 'Barbero' });
        const totalClientes = await Usuario.countDocuments({ tipoUsuario: 'Cliente' });
        const totalTurnos = await Turno.countDocuments();

        console.log('\n📊 Resumen de datos creados:');
        console.log(`  • Total usuarios: ${totalUsuarios}`);
        console.log(`    - Barberos: ${totalBarberos}`);
        console.log(`    - Clientes: ${totalClientes}`);
        console.log(`  • Total turnos: ${totalTurnos}`);

        console.log('\n🎉 Seed completado exitosamente!');
        console.log('\n📝 Credenciales de prueba:');
        console.log('  Barbero:');
        console.log('    Email: barbero@test.com');
        console.log('    Password: 123456');
        console.log('  Cliente:');
        console.log('    Email: cliente@test.com');
        console.log('    Password: 123456');

    } catch (error) {
        console.error('❌ Error al ejecutar el seed:', error);
        process.exit(1);
    } finally {
        // Cerrar conexión
        await mongoose.connection.close();
        console.log('\n🔌 Conexión cerrada');
        process.exit(0);
    }
};

// Ejecutar seed
seedDatabase();
