"use client";
import React, { useState } from "react";
import RecipeStatistics from "./Statistics";

export default function HomePage({ recipes, search, setSearch, sortOption, setSortOption, toggleFavorite, setPage, deleteRecipe, handleUpdate}) {
  
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortOption === "name") return a.name.localeCompare(b.name);
    if (sortOption === "kcal") return a.kcal - b.kcal;
    if (sortOption === "time") return parseInt(a.time) - parseInt(b.time);
  });

  const calculateStatistics = () => {
    if (recipes.length === 0) return null;

    const kcalValues = recipes.map((r) => Number(r.kcal));

    const minKcal = Math.min(...kcalValues);
    const maxKcal = Math.max(...kcalValues);
    const avgKcal = Math.round(kcalValues.reduce((sum, val) => sum + val, 0) / recipes.length);

    return { minKcal, maxKcal, avgKcal };
  };

  const stats = calculateStatistics();

  const getPriceStyle = (kcal) => {
    if (kcal === stats.minKcal) return { backgroundColor: "green" }; // Least calories
    if (kcal === stats.maxKcal) return { backgroundColor: "red" }; // Most calories
    if (kcal === stats.avgKcal) return { backgroundColor: "orange" }; // Average calories
    return {};
  };

  return (
    <div className="page-container">
      <h1>Search</h1>
      <p>What are you craving today?</p>

      <input
        type="text"
        placeholder="Type the dessert name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <select className="sort-dropdown" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="name">Sort by Name</option>
        <option value="kcal">Sort by Calories</option>
        <option value="time">Sort by Time</option>
      </select>

      {stats && <RecipeStatistics recipes={recipes} />}

      <div className="recipe-list">
        {[...new Map(sortedRecipes.map(r => [r.id, r])).values()].map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.image} alt={recipe.name} className="recipe-image" />
            <div className="recipe-info">
              <h3>{recipe.name}</h3>
              <p style={getPriceStyle(recipe.kcal)}>{recipe.kcal} Kcal • {recipe.time}</p>
              <p className="category-name">
  Category: {recipe.category && recipe.category.name ? recipe.category.name : "Unknown"}
</p>
            </div>
            <button className="fav-button" onClick={() => toggleFavorite(recipe)}>♥</button>
            <button className="delete-button" onClick={() => deleteRecipe(recipe.id)}>🗑</button>
            <button className="update-button" onClick={() => handleUpdate(recipe)}>✎</button>
          </div>
        ))}
      </div>
    </div>
  );
}
