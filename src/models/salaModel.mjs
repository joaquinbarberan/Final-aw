import conexion from '../config/db.mjs';

// El Modelo se encarga exclusivamente de interactuar con la base de datos (PostgreSQL).
// No sabe nada sobre peticiones HTTP o respuestas web, solo de tablas, filas y SQL.
const salaModelo = {
  // 1. Obtener todas las salas de la base de datos
  async obtenerTodas() {
    const consulta = 'SELECT * FROM salas ORDER BY id ASC';
    const resultado = await conexion.query(consulta);
    return resultado.rows; // Devuelve un array de objetos con las salas
  },

  // 2. Obtener una sala por su identificador único (ID)
  async obtenerPorId(id) {
    const consulta = 'SELECT * FROM salas WHERE id = $1';
    const resultado = await conexion.query(consulta, [id]);
    return resultado.rows[0]; // Devuelve la sala encontrada o undefined si no existe
  },

  // 3. Crear una nueva sala en la base de datos (Alta)
  async crear(datos) {
    const consulta = `
      INSERT INTO salas (nombre, capacidad_ninos, capacidad_adultos, precio, descripcion, imagen, alt_imagen)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const parametros = [
      datos.nombre,
      datos.capacidad_ninos || 0,
      datos.capacidad_adultos || 0,
      datos.precio || 0.00,
      datos.descripcion || '',
      datos.imagen || '',
      datos.alt_imagen || ''
    ];
    const resultado = await conexion.query(consulta, parametros);
    return resultado.rows[0]; // Devuelve la fila recién creada, incluyendo su ID generado
  },

  // 4. Actualizar los datos de una sala existente (Modificación)
  async actualizar(id, datos) {
    const consulta = `
      UPDATE salas
      SET nombre = $1,
          capacidad_ninos = $2,
          capacidad_adultos = $3,
          precio = $4,
          descripcion = $5,
          imagen = $6,
          alt_imagen = $7
      WHERE id = $8
      RETURNING *
    `;
    const parametros = [
      datos.nombre,
      datos.capacidad_ninos,
      datos.capacidad_adultos,
      datos.precio,
      datos.descripcion,
      datos.imagen,
      datos.alt_imagen,
      id
    ];
    const resultado = await conexion.query(consulta, parametros);
    return resultado.rows[0]; // Devuelve la sala modificada, o undefined si no se encontró el ID
  },

  // 5. Eliminar una sala de la base de datos (Baja)
  async eliminar(id) {
    const consulta = 'DELETE FROM salas WHERE id = $1 RETURNING *';
    const resultado = await conexion.query(consulta, [id]);
    return resultado.rows[0]; // Devuelve la sala eliminada para saber si efectivamente existía
  }
};

export default salaModelo;
