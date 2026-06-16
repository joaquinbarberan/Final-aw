import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'; // Carga las variables de entorno (.env)

// Importamos el enrutador y el controlador reestructurados (con nombres en español)
import rutasCRUD from './routers/salas.routers.mjs';
import salaControlador from './controladores/salas.controller.mjs';

const app = express();
const PUERTO = process.env.PORT || 3000;

// Middleware para interpretar datos JSON en solicitudes
app.use(express.json());

// Obtenemos las rutas absolutas para servir estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaPublic = path.join(__dirname, '../public');

// --- 1. ENRUTADO DE ARCHIVOS ESTÁTICOS ---
// Servimos la carpeta "public" en la raíz del servidor (http://localhost:3000/)
app.use(express.static(rutaPublic));

// Mapeo virtual: Solicitudes a "/recursos" cargan de "public".
// Esto resuelve las rutas de css, js e imágenes utilizadas en las plantillas HTML.
app.use('/recursos', express.static(rutaPublic));


// --- 2. ENRUTADO DE LAS APIS (MVC) ---

// Montamos la API CRUD bajo la VERSIÓN 1 (requerido por el docente)
app.use('/api/v1/salas', rutasCRUD);

// API REST de solo lectura para la Web pública (Punto 3.2.2 de la consigna)
// Mantenemos la ruta "/salas" que ya está siendo consumida por "public/js/salas.js"
app.get('/salas', salaControlador.listarSalas);
app.get('/salas/:id', salaControlador.obtenerSala);


// --- 3. INICIO DEL SERVIDOR ---
app.listen(PUERTO, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PUERTO}`);
  console.log(`Presiona Ctrl+C para detenerlo`);
});