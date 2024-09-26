import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../services/apiClient";

const EditRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [method, setMethod] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [marinationTime, setMarinationTime] = useState("");
  const [serves, setServes] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [recipeType, setRecipeType] = useState("");
  const [tags, setTags] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await apiClient.get(`/recipe/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.status === "success") {
          setRecipe(data.data.recipe);
          setRecipeName(data.data.recipe.name);
          setDescription(data.data.recipe.description);
          setIngredients(data.data.recipe.ingredients);
          setMethod(data.data.recipe.method);
          setCookingTime(data.data.recipe.cookingTime);
          setPreparationTime(data.data.recipe.preparationTime);
          setMarinationTime(data.data.recipe.marinationTime);
          setServes(data.data.recipe.serves);
          setCuisine(data.data.recipe.cuisine);
          setRecipeType(data.data.recipe.recipeType);
          setTags(data.data.recipe.tags);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(
        `/recipe/${id}`,
        {
          name: recipeName,
          description,
          ingredients,
          method,
          cookingTime,
          preparationTime,
          marinationTime,
          serves,
          cuisine,
          recipeType,
          tags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Recipe updated successfully!");
      navigate(`/recipe/${id}/${recipeName}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Failed to update the recipe. Please try again.");
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 mb-16 rounded-lg ">
      <h1 className="text-2xl mb-6 font-bold ">Edit Recipe</h1>

      <div className="mb-4">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-auto h-32 rounded-lg shadow-md mb-4"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Recipe Name:</label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Ingredients:</label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full h-[200px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Method:</label>
          <textarea
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full h-[200px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Cooking Time:</label>
            <input
              type="text"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Preparation Time:</label>
            <input
              type="text"
              value={preparationTime}
              onChange={(e) => setPreparationTime(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Marination Time:</label>
            <input
              type="text"
              value={marinationTime}
              onChange={(e) => setMarinationTime(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Serves:</label>
            <input
              type="number"
              value={serves}
              onChange={(e) => setServes(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-2">Cuisine:</label>
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Recipe Type:</label>
          <input
            type="text"
            value={recipeType}
            onChange={(e) => setRecipeType(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Tags:</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-between">
          <Link to={`/recipe/${id}/${recipe.name}`}>
            <button
              type="button"
              className="bg-orange-800 border-2 text-white py-2 px-4 rounded hover:bg-white hover:text-black hover:border-black transition"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="bg-black border-2 hover:border-black text-white py-2 px-4 rounded hover:bg-white hover:text-black transition"
          >
            Update Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;
