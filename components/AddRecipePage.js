import React, { useState, useEffect } from "react";
import config from '../config';

export default function AddRecipePage({ setPage, addRecipe, categories, setCategories }) {

  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [time, setTime] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/categories`, {
          headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
        }); 
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !kcal || !time || !image || !categoryId) return;

    const newRecipe = { name, kcal, time, image, CategoryId: categoryId };
    addRecipe(newRecipe);
    setPage("home");
};


  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return;

    try {
      if (Array.isArray(categories) && categories.some(cat => cat.name === newCategoryName)) {
          alert("Category name already exists!");
          return;
        }

      const response = await fetch(`${config.API_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ name: newCategoryName, description: newCategoryDescription }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories((prev) => Array.isArray(prev) ? [...prev, newCategory] : [newCategory]);
        setCategoryId(newCategory.id); 
        setNewCategoryName("");
        setNewCategoryDescription("");
      } else {
        console.error("Failed to add category:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`${config.API_URL}/api/categories/${categoryId}`, {
        method: "DELETE", headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== categoryId));
        if (categories.length > 1) {
          setCategoryId(categories[0].id); 
        } else {
          setCategoryId(""); 
        }
      } else {
        console.error("Failed to delete category:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="add-recipe-form">
        <h1>Add Recipe</h1>
        <input
          type="text"
          placeholder="Recipe Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Calories (kcal)"
          value={kcal}
          onChange={(e) => setKcal(e.target.value)}
        />
        <input
          type="text"
          placeholder="Time to prepare"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value))}>
          {(Array.isArray(categories) ? categories : []).map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}

        </select>

        <button type="submit">Add Recipe</button>
      </form>

      <form onSubmit={handleAddCategory} className="add-category-form">
        <h2>Add New Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <textarea
          placeholder="Category Description"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
        />
        <button type="submit">Add Category</button>
      </form>

      <ul className="category-list">
        {(Array.isArray(categories) ? categories : []).map((category) => (
        <li key={category.id} className="category-item">
          <span>{category.name}</span>
          <button
            className="delete-category-button"
            onClick={() => handleDeleteCategory(category.id)}
          >
            X
          </button>
        </li>
        ))}
      </ul>
    </div>
  );
}

