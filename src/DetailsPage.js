import React from "react";
import "./DetailsPage.css";
function DetailsPage({ pokemon, onBackClick }) {
  const capitalizedPokemonName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
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
  return (
    <div>
      <button className="details-back-btn" onClick={onBackClick}>
        Back
      </button>
      <div className="details-container">
        <div id="card" style={typeColors[pokemon.types[0]]}>
          <img
            src={pokemon.sprite}
            alt="Front Sprite"
            className="details-image"
          />
          <div className="poke-name">
            <h2 className="details-title">{capitalizedPokemonName}</h2>
          </div>
          <div className="types">
            {pokemon.types.map((type) => (
              <span key={type} className="type">
                {type}
              </span>
            ))}
          </div>
          <div className="stats">
            <p>Abilities: {pokemon.abilities.join(", ")}</p>
            <p>Height: {pokemon.height}</p>
            <p>Weight: {pokemon.weight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
