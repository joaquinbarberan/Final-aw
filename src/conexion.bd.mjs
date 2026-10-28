import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// Si existe DATABASE_URL (Neon/Supabase en producción) la usamos directamente.
// Si no, usamos las variables individuales (desarrollo local con PostgreSQL).
const conexion = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // requerido por Neon y Supabase
      }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE
      }
);

// Exportamos la conexión por defecto para poder utilizarla en los modelos
export default conexion;
