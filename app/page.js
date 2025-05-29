"use client";
import HomePage from "../components/HomePage";
import FavoritesPage from "../components/FavoritesPage";
import AddRecipePage from "../components/AddRecipePage";
import LoginPage from "../components/LoginPage";

import "./globals.css";
import React, { useEffect, useState, useRef } from "react";
import config from '../config';

export default function App() {
    const [page, setPage] = useState("home");
    const [search, setSearch] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [sortOption, setSortOption] = useState("name");
    const [categories, setCategories] = useState([]);
    const [token, setToken] = useState(null); // start with null
    const [loading, setLoading] = useState(true); // loading state
    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        }
        setLoading(false); 
      }
    }, []);




    const toggleFavorite = (recipe) => {
      setFavorites((prevFavorites) => {
          if (prevFavorites.some((fav) => fav.id === recipe.id)) {
              return prevFavorites.filter((fav) => fav.id !== recipe.id);
          } else {
              return [...prevFavorites, recipe];
          }
      });
    };


    const handleUpdate = (recipe) => {
      const newName = prompt("Enter new name:", recipe.name) || recipe.name;
      const newKcal = prompt("Enter new kcal:", recipe.kcal) || recipe.kcal;
      const newTime = prompt("Enter new time:", recipe.time) || recipe.time;
      const newImage = prompt("Enter new image URL:", recipe.image) || recipe.image;
      const newCategoryId = prompt("Enter new Category ID:", recipe.CategoryId) || recipe.CategoryId;
    
      const updatedRecipe = {
        id: recipe.id,
        name: newName,
        kcal: newKcal,
        time: newTime,
        image: newImage,
        CategoryId: newCategoryId,
      };
  
      fetch(`${config.API_URL}/api/recipes/${recipe.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" ,Authorization: `Bearer ${token}`,},
        body: JSON.stringify(updatedRecipe),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.id) {
            setRecipes((prev) =>
              prev.map((r) => (r.id === data.id ? data : r))
            );
          } else {
            alert("Error updating recipe.");
          }
        })
        .catch((error) => {
          console.error("Update failed:", error);
          alert("Error updating recipe.");
        });
    };


    const addRecipe = async (newRecipe) => {
      try {
          const res = await fetch(`${config.API_URL}/api/recipes`, {
              method: "POST",
              headers: { "Content-Type": "application/json" ,Authorization: `Bearer ${token}`,},
              body: JSON.stringify(newRecipe),
          });

          if (!res.ok) throw new Error("Failed to add recipe");

          const data = await res.json();

         
          if (data.category && !data.category.name) {
              const categoryRes = await fetch(`${config.API_URL}/api/categories/${data.CategoryId}`);
              const categoryData = await categoryRes.json();
              data.category = categoryData;
          }

          setRecipes((prev) => [...prev, data]);
      } catch (error) {
          console.error("Error adding recipe:", error);
          alert("Error adding recipe.");
      }
    };

    const deleteRecipe = async (id) => {
      try {
          const res = await fetch(`${config.API_URL}/api/recipes/${id}`, { method: "DELETE",headers: {
          Authorization: `Bearer ${token}`}});
      
          if (!res.ok) throw new Error("Failed to delete recipe");

          // Remove the deleted recipe from the state
          setRecipes((prevRecipes) => prevRecipes.filter((r) => r.id !== id));
          alert("Recipe deleted successfully.");
      } catch (error) {
          console.error("Error deleting recipe:", error);
          alert("Error deleting recipe.");
      }
    };

    const fetchRecipes = async () => {
      try {
          const res = await fetch(`${config.API_URL}/api/recipes?search=${encodeURIComponent(search)}`, { headers: {
          Authorization: `Bearer ${token}`  }});

          if (!res.ok) throw new Error("Failed to fetch recipes");
  
          const data = await res.json();
          setRecipes(data.recipes);
      } catch (error) {
          console.error("Error fetching recipes:", error);
          alert("Error fetching recipes.");
      }
    };

    
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${config.API_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    useEffect(() => {
      if (page === "add" && token) {
        fetchCategories();
      }
    }, [page, token]);


  
    useEffect(() => {
      if (page === "home" && token) {
        fetchRecipes();
      }
    }, [page, search, token]);

    const handleLogout = () => {
      localStorage.removeItem("token");
      setToken("");
      setPage("login");
    };


    if (loading) return <p>Loading...</p>;

    return (
        

        <div>
            {token && token !== "" ? (
            <>
              {page === "home" && (
                <HomePage
                  recipes={recipes}
                  search={search}
                  setSearch={setSearch}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  toggleFavorite={toggleFavorite}
                  setPage={setPage}
                  handleUpdate={handleUpdate}
                  deleteRecipe={deleteRecipe}
                />
              )}
              {page === "favorites" && <FavoritesPage favorites={favorites} setPage={setPage} />}
              {page === "add" && <AddRecipePage setPage={setPage} addRecipe={addRecipe} categories={categories}setCategories={setCategories}/>}
              <nav className="bottom-nav">
              <button onClick={() => setPage("home")} className={`nav-btn ${page === "home" ? "active" : ""}`} aria-label="Home">
                ⌂
              </button>
              <button onClick={() => setPage("favorites")} className={`nav-btn ${page === "favorites" ? "active" : ""}`} aria-label="Favorites">
                ♥
              </button>
              <button onClick={() => setPage("add")} className="nav-btn" aria-label="Add">
                ＋
              </button>
              <button onClick={handleLogout} className="nav-btn" aria-label="Logout">
                ⎋
              </button>
            </nav>
            </>
          ) : (
            <LoginPage setPage={setPage} setToken={setToken} />
          )}

        </div>
    );
}