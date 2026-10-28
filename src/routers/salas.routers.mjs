import express from 'express';
import multer from 'multer';
import salaControlador from '../controladores/salas.controller.mjs';

const enrutador = express.Router();

// En producción (Vercel) no hay disco persistente, así que guardamos el archivo
// en memoria y lo subimos a Cloudinary desde el controlador.
const subirArchivo = multer({ storage: multer.memoryStorage() });
const cargarImagen = subirArchivo.single('imagen');

// Obtener todas las salas (LECTURA 1)
enrutador.get('/', salaControlador.listarSalas);

// Obtener una sala por ID (LECTURA 2)
enrutador.get('/:id', salaControlador.obtenerSala);

// Crear una sala (ALTA)
enrutador.post('/', cargarImagen, salaControlador.crearSala);

// Modificar una sala (MODIFICACIÓN)
enrutador.put('/:id', cargarImagen, salaControlador.actualizarSala);

// Eliminar una sala (BAJA)
enrutador.delete('/:id', salaControlador.eliminarSala);

export default enrutador;
