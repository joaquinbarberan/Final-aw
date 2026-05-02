// recursos/js/modulos.js

export const renderizarSalas = (datos, contenedor) => {
    const htmlSalas = datos.map(sala => {
        // MAPEAMOS SEGÚN TU IMAGEN (image_97c0b5.png)
        const nombre = sala['company-name']; // Usamos corchetes por el guion
        const imagen = sala.img;             // En tu imagen dice 'img'
        const capacidad = sala.capacidad;     // En tu imagen dice 'capacidad'
        const precio = sala.precio;           // En tu imagen dice 'precio'
        
        // Como MockAPI no tiene 'descripcion', inventamos una con los datos
        const descripcionCompleta = `Sala con capacidad para ${capacidad} personas. Precio: $${precio}`;

        return `
            <article class="sala">
                <h2>${nombre || "Sala sin nombre"}</h2>
                <p>${descripcionCompleta}</p>
                <img src="${imagen}" alt="${nombre}" class="sala-imagen">
            </article>
        `;
    }).join('');

    contenedor.innerHTML = htmlSalas;
};