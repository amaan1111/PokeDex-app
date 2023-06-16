import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import DetailsPage from "./DetailsPage";
import Logo from "./assets/Pokédex_logo.png";
function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("");

  const typeColors = {
    normal: { backgroundColor: "#A8A878", color: "#FFF" },
    fire: { backgroundColor: "#F08030", color: "#FFF" },
    water: { backgroundColor: "#6890F0", color: "#FFF" },
    grass: { backgroundColor: "#78C850", color: "#FFF" },
    electric: { backgroundColor: "#F8D030", color: "#000" },
    ice: { backgroundColor: "#98D8D8", color: "#000" },
    fighting: { backgroundColor: "#C03028", color: "#FFF" },
    poison: { backgroundColor: "#A040A0", color: "#FFF" },
    ground: { backgroundColor: "#E0C068", color: "#000" },
    flying: { backgroundColor: "#A890F0", color: "#FFF" },
    psychic: { backgroundColor: "#F85888", color: "#FFF" },
    bug: { backgroundColor: "#A8B820", color: "#FFF" },
    rock: { backgroundColor: "#B8A038", color: "#FFF" },
    ghost: { backgroundColor: "#705898", color: "#FFF" },
    dragon: { backgroundColor: "#7038F8", color: "#FFF" },
    dark: { backgroundColor: "#705848", color: "#FFF" },
    steel: { backgroundColor: "#B8B8D0", color: "#000" },
    fairy: { backgroundColor: "#EE99AC", color: "#000" },
  };

  const fetchPokemon = async () => {
    try {
      setIsLoading(true);
      const offset = currentPage * 10;
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=10`
      );
      const results = response.data.results;

      const pokemonData = [];
      for (const pokemon of results) {
        const pokemonResponse = await axios.get(pokemon.url);
        const capitalizedPokemonName =
          pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        const pokemonDetails = {
          id: pokemonResponse.data.id,
          name: capitalizedPokemonName,
          types: pokemonResponse.data.types.map((type) => type.type.name),
          abilities: pokemonResponse.data.abilities.map(
            (ability) => ability.ability.name
          ),
          height: pokemonResponse.data.height,
          weight: pokemonResponse.data.weight,
          sprite:
            pokemonResponse.data.sprites.other["official-artwork"]
              .front_default,
        };

        pokemonData.push(pokemonDetails);
      }

      // Check if it's the first page, then set the pokemonList state
      if (currentPage === 0) {
        setPokemonList(pokemonData);
      } else {
        setPokemonList((prevList) => [...prevList, ...pokemonData]);
      }

      setCurrentPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const searchPokemon = async (term) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${term}`
      );

      const pokemonDetails = {
        name: response.data.name,
        types: response.data.types.map((type) => type.type.name),
        abilities: response.data.abilities.map(
          (ability) => ability.ability.name
        ),
        height: response.data.height,
        weight: response.data.weight,
        sprite: response.data.sprites.other["official-artwork"].front_default,
      };

      setSearchResults([pokemonDetails]);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.log(error);
      setSearchResults([]);
      setIsLoading(false);
      setError("Error searching for Pokémon. Please try again.");
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim() !== "") {
      searchPokemon(searchTerm.toLowerCase());
    }
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleBackClick = () => {
    setSelectedPokemon(null);
    setSearchResults([]);
    setSearchTerm("");
    setError(null);
  };
  const handleLoadMore = () => {
    fetchPokemon();
  };
  return (
    <div className="app-container">
      <img src={Logo} alt="logo" className="title" />
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="form-select"
      >
        <option value="">All Types</option>
        <option value="normal">Normal</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="grass">Grass</option>
        <option value="electric">electric</option>
        <option value="ice">ice</option>
        <option value="fighting">fighting</option>
        <option value="poison">poison</option>
        <option value="ground">ground</option>
        <option value="flying">flying</option>
        <option value="psychic">psychic</option>
        <option value="bug">bug</option>
        <option value="rock">rock</option>
        <option value="ghost">ghost</option>
        <option value="dragon">dragon</option>
        <option value="dark">dark</option>
        <option value="steel">steel</option>
        <option value="fairy">fairy</option>
      </select>

      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      {isLoading ? (
        <div className="spinner-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : selectedPokemon ? (
        <DetailsPage pokemon={selectedPokemon} onBackClick={handleBackClick} />
      ) : (
        <>
          {error && <p className="error-message">{error}</p>}
          <div className="card-grid">
            {searchResults.length > 0
              ? searchResults.map((pokemon) => (
                  <div>
                    <button
                      className="details-back-btn"
                      onClick={handleBackClick}
                    >
                      Back
                    </button>
                    <div
                      key={pokemon.name}
                      className="card-container"
                      onClick={() => handlePokemonClick(pokemon)}
                    >
                      <div className="card">
                        <div
                          className="card-body"
                          style={typeColors[pokemon.types[0]]}
                        >
                          <img
                            src={pokemon.sprite}
                            className="card-img-top"
                            alt={pokemon.name}
                          />
                          <h5 className="card-title">{pokemon.name}</h5>
                          <p className="card-text">
                            {pokemon.types.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : pokemonList
                  .filter((pokemon) =>
                    filterType ? pokemon.types.includes(filterType) : true
                  )
                  .map((pokemon) => (
                    <div
                      key={pokemon.name}
                      className="card-container"
                      onClick={() => handlePokemonClick(pokemon)}
                    >
                      <div className="card">
                        <div className="card-id">#{pokemon.id}</div>
                        <div
                          className="card-body"
                          style={typeColors[pokemon.types[0]]}
                        >
                          <img
                            src={pokemon.sprite}
                            className="card-img-top"
                            alt={pokemon.name}
                          />
                          <h5 className="card-title">{pokemon.name}</h5>
                          <p className="card-text">
                            {pokemon.types.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
          </div>
          <button
            className="btn btn-primary load-more-button"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </>
      )}
    </div>
  );
}

export default App;
