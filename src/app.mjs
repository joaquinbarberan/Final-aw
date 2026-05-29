import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'; // Carga las variables de entorno (.env)

// Importamos el enrutador del MVC y el controlador
import rutasCRUD from './routes/salaRoutes.mjs';
import salaControlador from './controllers/salaController.mjs';

const app = express();
const PUERTO = process.env.PORT || 3000;

// Middleware para permitir que el servidor reciba e interprete datos en formato JSON
app.use(express.json());

// Obtenemos la ruta de este archivo y del directorio raíz
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaPublic = path.join(__dirname, '../public');

// --- 1. ENRUTADO DE ARCHIVOS ESTÁTICOS ---
// Servimos la carpeta "public" en la raíz del servidor.
// Esto permite acceder a index.html en http://localhost:3000/
app.use(express.static(rutaPublic));

// Mapeo virtual: Hacemos que cualquier solicitud a "/recursos" busque los archivos en "public".
// Esto corrige los enlaces de los archivos HTML que apuntan a "./recursos/css/...",
// "./recursos/js/...", etc., sin tener que editar todas las rutas de los archivos HTML.
app.use('/recursos', express.static(rutaPublic));


// --- 2. ENRUTADO DE LAS APIS (MVC) ---

// Montamos la API CRUD completa (Alta, Baja, Modificación y Lecturas)
app.use('/api/salas', rutasCRUD);

// API REST de solo lectura para la Web pública (Punto 3.2.2 de la consigna)
// Exponemos 2 endpoints que llaman a los métodos de lectura del controlador.
// Esto mantiene compatible la página "salas.html" que ya consulta a "/salas".
app.get('/salas', salaControlador.listarSalas);       // Endpoint 1: Obtener todas
app.get('/salas/:id', salaControlador.obtenerSala);   // Endpoint 2: Obtener una por ID


// --- 3. INICIO DEL SERVIDOR ---
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});