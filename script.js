document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pokemon-container');
    const buscarBoton = document.getElementById('buscar-boton');
    const mostrarPokemonBoton = document.getElementById('mostrar-pokemon');
    const pokemonNombreInput = document.getElementById('pokemon-nombre');
    const pokemonSelect = document.getElementById('pokemon-select');

    function limpiarContenedor() {
        container.innerHTML = '';
    }

    function mostrarPokemon(datosPokemon) {
        const pokemonElemento = document.createElement('div');
        pokemonElemento.classList.add('pokemon');
        pokemonElemento.innerHTML = `
            <img src="${datosPokemon.sprites.front_default}" alt="${datosPokemon.name}">
            <h3>${datosPokemon.name.charAt(0).toUpperCase() + datosPokemon.name.slice(1)}</h3>
        `;
        container.appendChild(pokemonElemento);
    }

    async function buscarPokemon() {
        const pokemonNombre = pokemonNombreInput.value.trim().toLowerCase();
        if (!pokemonNombre) {
            alert('Por favor, ingresa el nombre de un Pokémon.');
            return;
        }

        try {
            const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNombre}`);
            if (!respuesta.ok) {
                throw new Error('Pokémon no encontrado');
            }
            const datosPokemon = await respuesta.json();
            limpiarContenedor();
            mostrarPokemon(datosPokemon);
        } catch (error) {
            limpiarContenedor();
            alert('Pokémon no encontrado. Por favor, intenta con otro nombre.');
        }
    }

    async function cargarListaPokemones() {
        try {
            const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
            if (!respuesta.ok) {
                throw new Error('Error al obtener la lista de Pokémon');
            }
            const datos = await respuesta.json();
            pokemonSelect.innerHTML = '<option value="">Selecciona un Pokémon</option>';  // Limpiar el select

            datos.results.forEach(pokemon => {
                const option = document.createElement('option');
                option.value = pokemon.url;
                option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                pokemonSelect.appendChild(option);
            });
        } catch (error) {
            alert('Error al obtener la lista de Pokémon.');
        }
    }

    async function mostrarPokemonSeleccionado() {
        const urlSeleccionado = pokemonSelect.value;
        if (!urlSeleccionado) {
            alert('Por favor, selecciona un Pokémon de la lista.');
            return;
        }

        try {
            const respuesta = await fetch(urlSeleccionado);
            if (!respuesta.ok) {
                throw new Error('Pokémon no encontrado');
            }
            const datosPokemon = await respuesta.json();
            limpiarContenedor();
            mostrarPokemon(datosPokemon);
        } catch (error) {
            limpiarContenedor();
            alert('Error al obtener el Pokémon seleccionado.');
        }
    }

    buscarBoton.addEventListener('click', buscarPokemon);
    mostrarPokemonBoton.addEventListener('click', mostrarPokemonSeleccionado);

    // Cargar la lista de Pokémon al cargar la página
    cargarListaPokemones();

    pokemonNombreInput.addEventListener('keypress', (evento) => {
        if (evento.key === 'Enter') {
            buscarPokemon();
        }
    });
});

