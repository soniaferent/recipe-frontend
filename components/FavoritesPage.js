// FavoritesPage.js
import React from "react";

function FavoritesPage({ favorites, setPage, toggleFavorite }) {
  return (
      <div>
          <h1>Favorites</h1>
          <div className="recipe-list">
              {favorites.map((recipe) => (
                  <div key={recipe.id} className="recipe-card">
                      <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                      <div className="recipe-info">
                          <h3>{recipe.name}</h3>
                          <p>{recipe.kcal} Kcal • {recipe.time}</p>
                      </div>
                      
                  </div>
              ))}
          </div>
      </div>
  );
}

export default FavoritesPage;

