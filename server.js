const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs'); // Configura EJS como motor de vistas
app.set('views', path.join(__dirname, 'views')); // Indica dónde están los archivos EJS

// Función para obtener personajes de Star Wars
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

loadCharacters(); // Llamar a la función para cargar los personajes

// Servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para renderizar la vista del menú
app.get('/', (req, res) => {
    res.render('menu'); // Renderiza el menú principal
});

app.get('/menu2', (req, res) => {
    res.render('menu2');
});

app.get('/map', (req, res) => {
    res.render('map');
});

// Ruta de búsqueda para filtrar personajes
app.get('/search', (req, res) => {
    const query = req.query.query; // Obtener el término de búsqueda del formulario

    // Filtrar los personajes según el término de búsqueda
    let filteredCharacters = starwarsChar;
    if (query) {
        filteredCharacters = starwarsChar.filter(character => 
            character.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    res.render('search_menu', { starwarsChar: filteredCharacters, query: query });
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
