import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import DetailsPage from "./DetailsPage";
import Logo from "./assets/Pokédex_logo.png";
function ListingsPage() {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [isSearchResultsDisplayed, setIsSearchResultsDisplayed] =
    useState(false);

  const typeColors = {
    Normal: { backgroundColor: "#A8A878", color: "#FFF" },
    Fire: { backgroundColor: "#F08030", color: "#FFF" },
    Water: { backgroundColor: "#6890F0", color: "#FFF" },
    Grass: { backgroundColor: "#78C850", color: "#FFF" },
    Electric: { backgroundColor: "#F8D030", color: "#000" },
    Ice: { backgroundColor: "#98D8D8", color: "#000" },
    Fighting: { backgroundColor: "#C03028", color: "#FFF" },
    Poison: { backgroundColor: "#A040A0", color: "#FFF" },
    Ground: { backgroundColor: "#E0C068", color: "#000" },
    Flying: { backgroundColor: "#A890F0", color: "#FFF" },
    Psychic: { backgroundColor: "#F85888", color: "#FFF" },
    Bug: { backgroundColor: "#A8B820", color: "#FFF" },
    Rock: { backgroundColor: "#B8A038", color: "#FFF" },
    Ghost: { backgroundColor: "#705898", color: "#FFF" },
    Dragon: { backgroundColor: "#7038F8", color: "#FFF" },
    Dark: { backgroundColor: "#705848", color: "#FFF" },
    Steel: { backgroundColor: "#B8B8D0", color: "#000" },
    Fairy: { backgroundColor: "#EE99AC", color: "#000" },
  };
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
          types: pokemonResponse.data.types.map((type) =>
            capitalizeFirstLetter(type.type.name)
          ),
          abilities: pokemonResponse.data.abilities.map((ability) =>
            capitalizeFirstLetter(ability.ability.name)
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
        types: response.data.types.map(
          (type) =>
            type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1) // Capitalize type name
        ),
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
      setIsSearchResultsDisplayed(true);
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
    setIsSearchResultsDisplayed(false);
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
        <option value="Normal">Normal</option>
        <option value="Fire">Fire</option>
        <option value="Water">Water</option>
        <option value="Grass">Grass</option>
        <option value="Electric">Electric</option>
        <option value="Ice">Ice</option>
        <option value="Fighting">Fighting</option>
        <option value="Poison">Poison</option>
        <option value="Ground">Ground</option>
        <option value="Flying">Flying</option>
        <option value="Psychic">Psychic</option>
        <option value="Bug">Bug</option>
        <option value="Rock">Rock</option>
        <option value="Ghost">Ghost</option>
        <option value="Dragon">Dragon</option>
        <option value="Dark">Dark</option>
        <option value="Steel">Steel</option>
        <option value="Fairy">Fairy</option>
      </select>

      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
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
                          <div className="card-text">
                            <span>{pokemon.types}</span>
                          </div>
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
                          <div className="card-text">
                            <span>{pokemon.types.join("|")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
          </div>
          {!isSearchResultsDisplayed && (
            <button
              className="btn btn-primary load-more-button"
              onClick={handleLoadMore}
            >
              Load Pokémon
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default ListingsPage;
