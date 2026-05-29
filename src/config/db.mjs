import pg from 'pg';
import 'dotenv/config'; // Carga las variables de entorno de .env a process.env

const { Pool } = pg;

// Creamos un Pool de conexiones a PostgreSQL.
// Un pool mantiene varias conexiones abiertas y las reutiliza, lo cual es mucho
// más eficiente que abrir y cerrar una conexión nueva en cada petición del usuario.
const conexion = new Pool({
  user: process.env.DB_USER,      // Usuario de la base de datos (ej: postgres)
  password: process.env.DB_PASSWORD,  // Contraseña del usuario
  host: process.env.DB_HOST,      // Servidor donde corre la base de datos (localhost)
  port: process.env.DB_PORT,      // Puerto de conexión (por defecto 5432)
  database: process.env.DB_DATABASE  // Nombre de la base de datos (diverty_park)
});

// Exportamos la conexión para poder usarla en otros archivos (como los modelos)
export default conexion;
