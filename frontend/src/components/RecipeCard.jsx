import React from "react";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{recipe.name}</h3>
        <p className="text-gray-600 mt-2">Ingredients: {recipe.ingredients}</p>
        <p className="text-gray-600 mt-1">
          Instructions: {recipe.instructions}
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
