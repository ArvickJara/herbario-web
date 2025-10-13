import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

// Carga las variables de entorno desde .env.local
dotenv.config({ path: '.env.local' });

export default defineConfig({
    // El "dialecto" de la base de datos. Para Turso, usamos 'sqlite'.
    dialect: 'sqlite',

    // La ruta al archivo donde definiste el esquema de tus tablas.
    schema: './api/db.ts',

    // La carpeta donde se guardarán los archivos de migración.
    out: './drizzle',

    // Las credenciales para conectarse a la base de datos de Turso.
    // Drizzle Kit las usará para generar y aplicar las migraciones.
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        token: process.env.TURSO_AUTH_TOKEN!,
    },

    // Habilita el modo verbose para ver más detalles en caso de error.
    verbose: true,
    // Desactiva la comprobación estricta, a veces ayuda con configuraciones complejas.
    strict: false,
});