const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

async function fetchStarWarsCharacters() {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://akabab.github.io/starwars-api/api/all.json');
    const characters = await response.json();
    return characters;
}

let starwarsChar = [];

async function loadCharacters() {
    try {
        starwarsChar = await fetchStarWarsCharacters();
        console.log('Personajes cargados:', starwarsChar.slice(0, 5));
    } catch (error) {
        console.error('Error al cargar los personajes:', error);
    }
}

loadCharacters();
app.use(express.static(path.join(__dirname, 'public')));

// Renderizado de vistas
app.get('/', (req, res) => {
    res.render('menu');
});

app.get('/menu2', (req, res) => {
    res.render('menu2');
});

app.get('/map', (req, res) => {
    res.render('map');
});

app.get('/future', (req, res) => {
    res.render('future');
});

app.get('/search', (req, res) => {
    const query = req.query.query;

    let filteredCharacters = starwarsChar;
    if (query) {
        filteredCharacters = starwarsChar.filter(character => 
            character.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    res.render('search_menu', { starwarsChar: filteredCharacters, query: query });
});

// Navegación entre personajes
app.get('/character/next/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    const nextIndex = (index + 1) % starwarsChar.length;
    const nextCharacter = starwarsChar[nextIndex];
    res.json({ character: nextCharacter, index: nextIndex });
});

app.get('/character/prev/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    const prevIndex = (index - 1 + starwarsChar.length) % starwarsChar.length; 
    const prevCharacter = starwarsChar[prevIndex];
    res.json({ character: prevCharacter, index: prevIndex });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});