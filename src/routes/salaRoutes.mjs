import express from 'express';
import salaControlador from '../controllers/salaController.mjs';

const enrutador = express.Router();

// Definimos las rutas del CRUD y las asociamos con su función en el Controlador.
// Estas rutas asumirán la base "/api/salas" cuando las importemos en app.mjs.

// 1. Obtener todas las salas (LECTURA 1)
enrutador.get('/', salaControlador.listarSalas);

// 2. Obtener una sala por ID (LECTURA 2)
enrutador.get('/:id', salaControlador.obtenerSala);

// 3. Crear una nueva sala (ALTA)
enrutador.post('/', salaControlador.crearSala);

// 4. Modificar una sala existente (MODIFICACIÓN)
enrutador.put('/:id', salaControlador.actualizarSala);

// 5. Eliminar una sala (BAJA)
enrutador.delete('/:id', salaControlador.eliminarSala);

export default enrutador;
