import React, { useState } from "react";

function RecipeStatistics({ recipes }) {
    if (recipes.length === 0) return <p>No recipes available.</p>;

    
    const totalRecipes = recipes.length;
    const totalCalories = recipes.reduce((sum, r) => sum + Number(r.kcal), 0);
    const avgCalories = Math.round(totalCalories / totalRecipes);
    const minCalories = Math.min(...recipes.map(r => Number(r.kcal)));
    const maxCalories = Math.max(...recipes.map(r => Number(r.kcal)));

    const totalTime = recipes.reduce((sum, r) => sum + parseInt(r.time), 0);
    const avgTime = Math.round(totalTime / totalRecipes);
    const minTime = Math.min(...recipes.map(r => parseInt(r.time)));
    const maxTime = Math.max(...recipes.map(r => parseInt(r.time)));

    return (
        <div className="recipe-statistics">
            <h3>Recipe Statistics</h3>
            <p>Total Recipes: {totalRecipes}</p>
            <p>
                Calories:
                <span style={{ fontWeight: "bold", color: "green" }}> Min: {minCalories}</span>
                <span style={{ fontWeight: "bold", color: "red" }}> Max: {maxCalories}</span>
                <span style={{ fontWeight: "bold", color: "orange" }}> Avg: {avgCalories}</span>
            </p>
            <p>
                Time:
                <span style={{ fontWeight: "bold", color: "green" }}> Min: {minTime} min</span>
                <span style={{ fontWeight: "bold", color: "red" }}> Max: {maxTime} min</span>
                <span style={{ fontWeight: "bold", color: "orange" }}> Avg: {avgTime} min</span>
            </p>
        </div>
    );
}

export default RecipeStatistics;
