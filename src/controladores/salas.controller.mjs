import salaModelo from '../modelos/salas.model.mjs';
import { subirImagen } from '../storage.mjs';

const IMAGEN_DEFAULT = 'https://placehold.co/600x400?text=Diverty+Park';

const salaControlador = {

  // 1. Obtener todas las salas (GET /api/v1/salas)
  async listarSalas(peticion, respuesta) {
    try {
      const salas = await salaModelo.obtenerTodas();
      respuesta.json(salas);
    } catch (error) {
      console.error('Error al listar salas:', error);
      respuesta.status(500).json({ error: 'Hubo un problema al obtener las salas.' });
    }
  },

  // 2. Obtener una sala por ID (GET /api/v1/salas/:id)
  async obtenerSala(peticion, respuesta) {
    try {
      const sala = await salaModelo.obtenerPorId(peticion.params.id);
      if (!sala) return respuesta.status(404).json({ error: 'La sala solicitada no existe.' });
      respuesta.json(sala);
    } catch (error) {
      console.error('Error al obtener sala:', error);
      respuesta.status(500).json({ error: 'Hubo un problema al obtener la sala.' });
    }
  },

  // 3. Crear una sala (POST /api/v1/salas)
  async crearSala(peticion, respuesta) {
    try {
      const cuerpo = peticion.body;
      if (!cuerpo.nombre || cuerpo.nombre.trim() === '') {
        return respuesta.status(400).json({ error: 'El nombre de la sala es obligatorio.' });
      }

      // Si se subió un archivo, lo enviamos a Cloudinary; si no, usamos la imagen por defecto
      let urlImagen = IMAGEN_DEFAULT;
      if (peticion.file) {
        urlImagen = await subirImagen(peticion.file.buffer, peticion.file.originalname);
      }

      const datosSala = {
        nombre:            cuerpo.nombre.trim(),
        capacidad_ninos:   parseInt(cuerpo.capacidad_ninos) || 0,
        capacidad_adultos: parseInt(cuerpo.capacidad_adultos) || 0,
        precio:            parseFloat(cuerpo.precio) || 0.00,
        descripcion:       cuerpo.descripcion || '',
        imagen:            urlImagen,
        alt_imagen:        cuerpo.alt_imagen || cuerpo.nombre
      };

      const nuevaSala = await salaModelo.crear(datosSala);
      respuesta.status(201).json(nuevaSala);
    } catch (error) {
      console.error('Error al crear sala:', error);
      respuesta.status(500).json({ error: 'Hubo un problema al crear la sala.' });
    }
  },

  // 4. Actualizar una sala (PUT /api/v1/salas/:id)
  async actualizarSala(peticion, respuesta) {
    try {
      const id = peticion.params.id;
      const cuerpo = peticion.body;

      if (!cuerpo.nombre || cuerpo.nombre.trim() === '') {
        return respuesta.status(400).json({ error: 'El nombre de la sala es obligatorio.' });
      }

      // Si se subió un archivo nuevo lo subimos a Cloudinary; si no, mantenemos la imagen existente
      let urlImagen = cuerpo.imagen_existente || IMAGEN_DEFAULT;
      if (peticion.file) {
        urlImagen = await subirImagen(peticion.file.buffer, peticion.file.originalname);
      }

      const datosSala = {
        nombre:            cuerpo.nombre.trim(),
        capacidad_ninos:   parseInt(cuerpo.capacidad_ninos) || 0,
        capacidad_adultos: parseInt(cuerpo.capacidad_adultos) || 0,
        precio:            parseFloat(cuerpo.precio) || 0.00,
        descripcion:       cuerpo.descripcion || '',
        imagen:            urlImagen,
        alt_imagen:        cuerpo.alt_imagen || cuerpo.nombre
      };

      const salaActualizada = await salaModelo.actualizar(id, datosSala);
      if (!salaActualizada) return respuesta.status(404).json({ error: 'No se encontró la sala.' });

      respuesta.json(salaActualizada);
    } catch (error) {
      console.error('Error al actualizar sala:', error);
      respuesta.status(500).json({ error: 'Hubo un problema al actualizar la sala.' });
    }
  },

  // 5. Eliminar una sala (DELETE /api/v1/salas/:id)
  async eliminarSala(peticion, respuesta) {
    try {
      const salaEliminada = await salaModelo.eliminar(peticion.params.id);
      if (!salaEliminada) return respuesta.status(404).json({ error: 'No se encontró la sala.' });
      respuesta.json({ mensaje: 'Sala eliminada correctamente', sala: salaEliminada });
    } catch (error) {
      console.error('Error al eliminar sala:', error);
      respuesta.status(500).json({ error: 'Hubo un problema al eliminar la sala.' });
    }
  }
};

export default salaControlador;
