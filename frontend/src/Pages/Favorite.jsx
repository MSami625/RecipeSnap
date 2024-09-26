import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
    const fetchFavorites = async () => {
      try {
        const response = await apiClient.get("recipes/favorites", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFavorites(response.data.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setMessage("No Favorites Found");
      }
    };

    fetchFavorites();
  }, []);

  return (
    <>
      <Navbar />
      <div className="favorites-page mt-32 p-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">
          Your Favorites
        </h1>
        {message && <p className="text-red-600">{message}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Favorite;
