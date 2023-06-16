import React from "react";
import "./DetailsPage.css";

function DetailsPage({ pokemon, onBackClick }) {
  const capitalizedPokemonName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <>
      <button className="details-back-btn" onClick={onBackClick}>
        Back
      </button>
      <div className="details-container">
        <div className="details-header">
          <h2 className="details-title">{capitalizedPokemonName}</h2>
        </div>
        <div className="details-body">
          <div className="details-row">
            <div className="details-col">
              <img
                src={pokemon.sprite}
                alt="Front Sprite"
                className="details-image"
              />
            </div>
            <div className="details-col">
              <p className="details-text">Types: {pokemon.types.join(", ")}</p>
              <p className="details-text">
                Abilities: {pokemon.abilities.join(", ")}
              </p>
              <p className="details-text">Height: {pokemon.height}</p>
              <p className="details-text">Weight: {pokemon.weight}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailsPage;
