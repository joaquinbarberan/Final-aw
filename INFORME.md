# Informe Técnico del Proyecto: Diverty Park (TP 3 / Parcial 2)

Este informe detalla la arquitectura, el diseño de base de datos, la integración de la API REST versionada, la subida de imágenes y el uso de Inteligencia Artificial para el desarrollo de la aplicación **Diverty Park**, un sistema de gestión para salones de fiestas infantiles.

---

## 1. Arquitectura del Proyecto (Patrón MVC)

La aplicación backend se ha desarrollado utilizando **Node.js** y **Express**, organizando el código bajo el patrón de diseño **MVC (Modelo-Vista-Controlador)**. Esta estructura desacopla las responsabilidades del sistema en capas independientes:

```text
                     ┌────────────────────────┐
                     │         VISTA          │ (HTML, CSS, JS en public/)
                     └──────────┬─────────────┘
                                │  peticiones HTTP (fetch AJAX)
                                ▼
                     ┌────────────────────────┐
                     │        ROUTERS         │ (src/routers/salas.routers.mjs)
                     └──────────┬─────────────┘
                                │  asocia URL a controlador
                                ▼
                     ┌────────────────────────┐
                     │      CONTROLADOR       │ (src/controladores/salas.controller.mjs)
                     └──────────┬─────────────┘
                                │  gestiona req/res y Multer
                                ▼
                     ┌────────────────────────┐
                     │         MODELO         │ (src/modelos/salas.model.mjs)
                     └──────────┬─────────────┘
                                │  consultas SQL nativas
                                ▼
                     ┌────────────────────────┐
                     │     BASE DE DATOS      │ (PostgreSQL en puerto 5432)
                     └────────────────────────┘
```

### Descripción de las Capas:
1.  **Modelo (`modelos/`)**: Encargado exclusivo de interactuar con la base de datos PostgreSQL. Ejecuta sentencias SQL nativas (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
2.  **Controlador (`controladores/`)**: Contiene la lógica de negocio. Procesa los parámetros de la petición HTTP (`req.body`, `req.params`, `req.file`), delega el almacenamiento al Modelo, valida campos obligatorios en el servidor, e implementa códigos de estado HTTP correctos para responder al cliente (`res.json`).
3.  **Rutas (`routers/`)**: Define los endpoints disponibles y asigna el middleware de procesamiento de archivos (Multer) a las rutas de escritura antes de invocar al controlador.
4.  **Vista (`public/`)**: Frontend estático que consume la API usando llamadas asíncronas (`fetch`).

### Justificación de la Estructura en Español:
Se ha reestructurado el proyecto renombrando los directorios a `controladores/`, `modelos/` y `routers/` (y moviendo la conexión a `conexion.bd.mjs` y el sembrador a `seed.mjs`) para respetar el estándar propuesto por la cátedra y visto en clase.

---

## 2. Diseño de la Base de Datos (PostgreSQL)

La información de las salas de fiestas se almacena en una tabla relacional llamada `salas` dentro de la base de datos `diverty_park` en PostgreSQL.

### Esquema de la Tabla:
```sql
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
```

### Detalles de la Implementación:
*   `id`: Clave primaria autoincremental (`SERIAL`).
*   `precio`: Almacenado como tipo `DECIMAL` para garantizar precisión monetaria.
*   `imagen`: Guarda la ruta relativa física (ej. `./recursos/imagenes/u1y2t3.png`) donde se aloja el archivo subido por Multer para permitir su carga inmediata en el navegador.

---

## 3. Endpoints de la API REST Versionada (`/api/v1`)

Para cumplir con las buenas prácticas de diseño de APIsREST explicadas en clase, se implementó el versionado de rutas bajo el prefijo `/api/v1`.

| Método HTTP | Endpoint | Descripción | Tipo de Cuerpo (Request) | Respuesta Exitosa (HTTP Code) |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/salas` | Obtiene la lista completa de salas. | Ninguno | `200 OK` (JSON Array) |
| **GET** | `/api/v1/salas/:id` | Obtiene los datos de una sala por su ID. | Ninguno | `200 OK` (JSON Object) |
| **POST** | `/api/v1/salas` | Crea una nueva sala (Alta). | `multipart/form-data` | `201 Created` (JSON Object) |
| **PUT** | `/api/v1/salas/:id` | Modifica una sala existente. | `multipart/form-data` | `200 OK` (JSON Object) |
| **DELETE** | `/api/v1/salas/:id` | Elimina una sala por su ID (Baja). | Ninguno | `200 OK` (JSON Object) |

Además, se exponen 2 endpoints públicos de solo lectura en `/salas` y `/salas/:id` para la web del cliente.

---

## 4. Subida de Archivos con Multer

En el Parcial 2 se implementó la subida física de imágenes al servidor usando el middleware **Multer**.

### Flujo del Archivo:
1.  **Cliente (Frontend)**: En `admin.html`, el input de tipo texto se reemplazó por un `<input type="file" name="imagen">`. El JavaScript utiliza el objeto `FormData` para enviar la información codificada como `multipart/form-data` al servidor.
2.  **Servidor (Middleware)**: Multer recibe el flujo binario, lo valida y lo almacena físicamente en el disco local bajo la carpeta `./public/imagenes`.
3.  **Identificador Único**: Para evitar que dos imágenes con el mismo nombre se sobrescriban, usamos la librería `nanoid` para generar nombres alfanuméricos aleatorios de 21 caracteres, y la librería `mime-type` para deducir la extensión a partir del tipo de archivo (ej. `image/jpeg` -> `jpg`).
4.  **Base de Datos**: Se almacena la ruta relativa `./recursos/imagenes/[nombre_generado].[extension]` en la base de datos.
5.  **Edición sin Cambios**: Si al editar no se selecciona ningún archivo, el frontend envía en el campo oculto `imagen_existente` la ruta actual, previniendo que se borre la imagen de la base de datos.

---

## 5. Bitácora de Prompts de Inteligencia Artificial (IA)

Este proyecto se desarrolló asistido por IA. A continuación se presentan algunos de los prompts utilizados para guiar el proceso y resolver problemas de implementación:

*   **Prompt 1 (Arquitectura MVC y Postgres)**:
    > *"Necesito estructurar un servidor backend en Node.js y Express utilizando el patrón MVC. Tengo que conectarme a PostgreSQL y mapear un archivo de datos JSON a una tabla llamada salas. ¿Cómo estructuro los archivos del modelo, controlador y rutas en ES Modules y cómo configuro el Pool de conexión?"*
    *   *Uso de la IA*: La IA propuso la separación de responsabilidades y la estructura de archivos que sirvió de base para las capas de base de datos.
*   **Prompt 2 (Reestructuración de carpetas)**:
    > *"Mi profesor me indicó que debo usar la organización de carpetas propuesta en clase. En sus proyectos de clase las carpetas se llaman controladores, modelos y routers en español, y el archivo de base de datos es conexion.bd.mjs. Ayúdame a reestructurar todos los imports y mover los archivos a estas nuevas rutas."*
    *   *Uso de la IA*: La IA generó las rutas de importación relativas correctas (`../controladores/...`, etc.) y diseñó la nueva disposición de carpetas.
*   **Prompt 3 (Implementación de Multer y FormData)**:
    > *"Debo implementar la subida de imágenes con multer. En clase usamos multer.diskStorage con destination a una carpeta local y filename renombrando el archivo con nanoid() y mime.extension(file.mimetype). En el frontend tengo un formulario de administración. ¿Cómo paso el formulario de JSON a FormData en el cliente para que viaje la imagen física, y cómo recibo req.file en el controlador?"*
    *   *Uso de la IA*: La IA diseñó el middleware del ruteador utilizando Multer, enseñó a usar el objeto `FormData` nativo de JavaScript para envolver el formulario en el frontend y adaptó el controlador para recibir tanto `req.body` como `req.file`.
