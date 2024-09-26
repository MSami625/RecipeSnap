import React from "react";
import { Link } from "react-router-dom";
import chefImg from "../assets/chef.png";

const RecipeCard = ({ recipe }) => {
  if (!recipe) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg shadow-lg">
        <p className="text-xl font-semibold text-gray-700">No Recipes Shared</p>
      </div>
    );
  }

  return (
    <Link
      to={`/recipe/${recipe.id}/${recipe.name}`}
      className="border rounded-lg overflow-hidden shadow-lg block transition-transform transform hover:scale-105"
    >
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 h-full bg-white">
        <h3 className="font-bold text-xl">{recipe.name}</h3>
        {recipe.description.length > 25
          ? recipe.description.slice(0, 25) + "..."
          : recipe.description}

        <div className="flex justify-between items-center mt-2">
          {recipe.rating && (
            <div className="flex items-center">
              <span className="text-yellow-500">
                {"⭐".repeat(recipe.rating)}
              </span>
              <span className="text-gray-600 ml-1">({recipe.rating}) of 5</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-between mb-1">
          <p className="text-gray-600 mt-2">
            <img src={chefImg} alt="chef" className="w-6 h-6 inline-block" />
            <span className="text-black">{recipe.ownerName}</span>
          </p>
          <p className="text-gray-600 mt-2">
            <strong>Type:</strong>{" "}
            <span className="text-green-600">{recipe.recipeType}</span>
          </p>
        </div>
        <p className="text-gray-600">
          <strong>Cuisine:</strong>{" "}
          <span className="text-blue-600">{recipe.cuisine}</span>
        </p>
      </div>
    </Link>
  );
};

export default RecipeCard;
