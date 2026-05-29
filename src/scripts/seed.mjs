import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import conexion from '../config/db.mjs';

// Obtenemos la ruta absoluta de la carpeta actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo JSON con los datos iniciales
const rutaJSON = path.join(__dirname, '../../recursos/datos_salas.json');

async function sembrarBaseDeDatos() {
  try {
    console.log('--- Iniciando Sembrado de Base de Datos ---');

    // 1. Definición de la sentencia SQL para crear la tabla de salas si no existe
    const consultaCrearTabla = `
      CREATE TABLE IF NOT EXISTS salas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        capacidad_ninos INT NOT NULL DEFAULT 0,
        capacidad_adultos INT NOT NULL DEFAULT 0,
        precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        descripcion TEXT,
        imagen VARCHAR(255),
        alt_imagen VARCHAR(255)
      );
    `;

    console.log('Creando tabla "salas" si no existe...');
    await conexion.query(consultaCrearTabla);
    console.log('Tabla creada o ya existente con éxito.');

    // 2. Verificar si ya hay registros para no duplicarlos cada vez que se corra este script
    const resultadoCheck = await conexion.query('SELECT COUNT(*) FROM salas');
    const cantidadRegistros = parseInt(resultadoCheck.rows[0].count);

    if (cantidadRegistros > 0) {
      console.log(`La tabla ya contiene ${cantidadRegistros} salas. No es necesario insertar datos iniciales.`);
      return;
    }

    // 3. Leer y parsear el archivo datos_salas.json
    console.log('Leyendo datos iniciales desde datos_salas.json...');
    const contenidoJSON = fs.readFileSync(rutaJSON, 'utf-8');
    const salasIniciales = JSON.parse(contenidoJSON);

    // 4. Insertar cada sala del archivo JSON en la base de datos
    console.log('Insertando salas iniciales...');
    for (const sala of salasIniciales) {
      // Mapeamos los campos del JSON y definimos un precio por defecto para las salas iniciales
      const nombre = sala.nombre;
      const capacidadNinos = sala.capacidad_ninos;
      const capacidadAdultos = sala.capacidad_adultos;
      const precioDefecto = 15000.00; // Asignamos un precio base inicial
      const descripcion = sala.descripcion;
      const imagen = sala.imagen;
      const altImagen = sala.alt_imagen;

      const consultaInsertar = `
        INSERT INTO salas (nombre, capacidad_ninos, capacidad_adultos, precio, descripcion, imagen, alt_imagen)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      await conexion.query(consultaInsertar, [
        nombre,
        capacidadNinos,
        capacidadAdultos,
        precioDefecto,
        descripcion,
        imagen,
        altImagen
      ]);
      console.log(`Sala insertada: ${nombre}`);
    }

    console.log('¡Sembrado completado con éxito!');
  } catch (error) {
    console.error('Error durante el sembrado de la base de datos:');
    console.error(error.message);
    if (error.code === '3D000') {
      console.error('\n⚠️  ERROR: La base de datos "diverty_park" no existe.');
      console.error('Por favor, conéctate a tu PostgreSQL y ejecuta: CREATE DATABASE diverty_park;\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  ERROR: No se pudo conectar a PostgreSQL. Verifica que el servicio esté corriendo y los datos en tu archivo .env sean correctos.\n');
    }
  } finally {
    // Cerramos el Pool de conexiones al finalizar
    await conexion.end();
    console.log('--- Conexión con la Base de Datos Cerrada ---');
  }
}

// Ejecutamos la función de sembrado
sembrarBaseDeDatos();
