export const renderizarSalas = (datos, contenedor) => {


    const htmlSalas = datos.map(sala => {
        const descripcionCompleta = sala.descripcion
            .replace('[N]', `<b>${sala.capacidad_ninos} niños</b>`)
            .replace('[A]', `<b>${sala.capacidad_adultos} adultos</b>`);

        return `
            <article class="sala">
                <h2>${sala.nombre}</h2>
                <p>• ${descripcionCompleta}</p>
                <img src="${sala.imagen}" alt="${sala.alt_imagen}" class="sala-imagen">
            </article>
        `;
    }).join('');

    contenedor.innerHTML = htmlSalas;
};


