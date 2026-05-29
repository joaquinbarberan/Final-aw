import salaModelo from '../models/salaModel.mjs';

// El Controlador recibe la petición del cliente (Request), invoca al Modelo
// para operar en la base de datos y le responde al cliente (Response) con JSON.
const salaControlador = {
  // 1. Maneja la lectura de todas las salas (GET /api/salas)
  async listarSalas(peticion, respuesta) {
    try {
      const salas = await salaModelo.obtenerTodas();
      respuesta.json(salas); // Devuelve la lista en formato JSON
    } catch (error) {
      console.error('Error al listar salas:', error);
      respuesta.status(500).json({ error: 'Hubo un problema al obtener las salas.' });
    }
  },

  // 2. Maneja la lectura de una sola sala por ID (GET /api/salas/:id)
  async obtenerSala(peticion, respuesta) {
    try {
      const id = peticion.params.id;
      const sala = await salaModelo.obtenerPorId(id);

      if (!sala) {
        return respuesta.status(404).json({ error: 'La sala solicitada no existe.' });
      }

      respuesta.json(sala);
    } catch (error) {
      console.error('Error al obtener sala por ID:', error);
      respuesta.status(500).json({ error: 'Hubo un problema al obtener los datos de la sala.' });
    }
  },

  // 3. Maneja la creación de una nueva sala (POST /api/salas - ALTA)
  async crearSala(peticion, respuesta) {
    try {
      const datos = peticion.body;

      // Validación simple en el servidor: el nombre es obligatorio
      if (!datos.nombre || datos.nombre.trim() === '') {
        return respuesta.status(400).json({ error: 'El nombre de la sala es obligatorio.' });
      }

      const nuevaSala = await salaModelo.crear(datos);
      respuesta.status(201).json(nuevaSala); // 201 significa "Creado exitosamente"
    } catch (error) {
      console.error('Error al crear sala:', error);
      respuesta.status(500).json({ error: 'Hubo un problema al crear la sala.' });
    }
  },

  // 4. Maneja la actualización de una sala existente (PUT /api/salas/:id - MODIFICACIÓN)
  async actualizarSala(peticion, respuesta) {
    try {
      const id = peticion.params.id;
      const datos = peticion.body;

      // Validación simple en el servidor: el nombre es obligatorio
      if (!datos.nombre || datos.nombre.trim() === '') {
        return respuesta.status(400).json({ error: 'El nombre de la sala es obligatorio para actualizar.' });
      }

      const salaActualizada = await salaModelo.actualizar(id, datos);

      if (!salaActualizada) {
        return respuesta.status(404).json({ error: 'No se encontró la sala a actualizar.' });
      }

      respuesta.json(salaActualizada);
    } catch (error) {
      console.error('Error al actualizar sala:', error);
      respuesta.status(500).json({ error: 'Hubo un problema al actualizar la sala.' });
    }
  },

  // 5. Maneja la eliminación de una sala (DELETE /api/salas/:id - BAJA)
  async eliminarSala(peticion, respuesta) {
    try {
      const id = peticion.params.id;
      const salaEliminada = await salaModelo.eliminar(id);

      if (!salaEliminada) {
        return respuesta.status(404).json({ error: 'No se encontró la sala a eliminar.' });
      }

      respuesta.json({ mensaje: 'Sala eliminada correctamente', sala: salaEliminada });
    } catch (error) {
      console.error('Error al eliminar sala:', error);
      respuesta.status(500).json({ error: 'Hubo un problema al eliminar la sala.' });
    }
  }
};

export default salaControlador;
