const express = require('express');
const path = require('path');
const app = express();

async function fetchStarWarsCharacters() {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://akabab.github.io/starwars-api/api/all.json');
    const characters = await response.json();
    return characters;
}

let starwarsChar = [];

// Cargar personajes al inicio del servidor
async function loadCharacters() {
    try {
        starwarsChar = await fetchStarWarsCharacters();
        console.log('Personajes cargados:', starwarsChar.slice(0, 5));
    } catch (error) {
        console.error('Error al cargar los personajes:', error);
    }
}

// Llamar a la función para cargar los personajes
loadCharacters();

// Sirve los archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Sirve el HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta API para enviar los personajes al cliente
app.get('/api/characters', (req, res) => {
  res.json(starwarsChar);
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
