import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Agregá este import arriba de todo
const PUERTO = 3000
const app = express()
app.use(express.json())
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

const MOCK_API_URL = "https://69f62705a72f01a951b93497.mockapi.io/Salas"
app.get('/salas' , async(req ,res)=>{
    const respuesta = await fetch(MOCK_API_URL);
    const datos = await respuesta.json();
    res.json(datos);
})





app.listen(PUERTO, () => {
    console.log(`servisor corriendo en http://localhost${PUERTO}`)
})