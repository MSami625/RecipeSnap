import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import StarRatings from "react-star-ratings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartBroken } from "@fortawesome/free-solid-svg-icons";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }

    const favoriteRecipes = async () => {
      try {
        const { data } = await apiClient.get("/recipes/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.status === "success") {
          const recipes = data.data;
          const isFavorite = recipes.some((recipe) => {
            return recipe.id === parseInt(id);
          });

          setIsFavorite(isFavorite);
        }
      } catch (err) {
        console.log(err);
      }
    };

    favoriteRecipes();
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }

    const fetchRecipe = async () => {
      try {
        const { data } = await apiClient.get(`/recipe/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.status === "success") {
          setRecipe(data.data.recipe);
          setReviews(data.data.reviews || []);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipe();
  }, [id, token]);

  const userId = token ? jwtDecode(token).userId : null;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (!confirmDelete) return;

    try {
      await apiClient.delete(`/recipe/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Recipe deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete the recipe. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !newReview) return;

    try {
      await apiClient.post(
        `/recipe/${id}/review`,
        {
          rating,
          review: newReview,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews([
        ...reviews,
        {
          userId,
          text: newReview,
          rating,
          reviewerName: "You",
          createdAt: new Date().toLocaleDateString(),
        },
      ]);
      setNewReview("");
      setRating(0);
      alert("Rating and review submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating and review:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      await apiClient.post(
        `/recipe/${id}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFavorite(!isFavorite);
      alert(isFavorite ? "Removed from favorites!" : "Added to favorites!");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to toggle favorite. Please try again.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }

    const fetchFavorites = async () => {
      try {
        const { data } = await apiClient.get("/recipes/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchFavorites();
  }, [token]);

  if (!recipe) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg shadow-lg">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex gap-10 font-poppins mt-24 flex-col md:flex-row p-10">
        <div className="flex flex-col md:w-1/2">
          <div className="md:w-full md:pr-4 mb-4 rounded-lg shadow-lg p-2 bg-orange-300">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="flex flex-col  md:flex-row items-center justify-between pl-4 mb-4">
            <div className="flex items-center justify-center mb-4 md:mb-0">
              <div
                onClick={handleFavoriteToggle}
                className={`flex items-center cursor-pointer transition-transform duration-300 
        ${isFavorite ? "text-red-500 scale-110" : "text-gray-500"}`}
              >
                <FontAwesomeIcon
                  icon={isFavorite ? faHeart : faHeartBroken}
                  className="h-6 w-4 md:h-6 md:w-6"
                />
                <p className="ml-2 text-sm font-semibold">
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center justify-center">
              <span className="text-sm md:text-lg  font-poppins font-semibold mr-2">
                Rating:
              </span>
              <StarRatings
                rating={recipe.rating || 0}
                starRatedColor="gold"
                numberOfStars={5}
                name="rating"
                starDimension="20px"
                starSpacing="3px"
              />
            </div>
          </div>

          {userId === recipe.userId && (
            <div className="mt-4">
              <button
                onClick={() => navigate(`/recipe/${id}/${recipe.name}/edit`)}
                className="mr-4 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {[
              { label: "Cooking Time", value: recipe.cookingTime },
              { label: "Preparation Time", value: recipe.preparationTime },
              { label: "Marination Time", value: recipe.marinationTime },
              { label: "Serves", value: recipe.serves },
              { label: "Cuisine", value: recipe.cuisine },
              { label: "Recipe Type", value: recipe.recipeType },
              { label: "Author", value: recipe.ownerName },
              { label: "Tags", value: recipe.tags },
            ].map((detail, index) => (
              <div
                key={index}
                className="bg-gray-100 p-2 rounded-lg shadow hover:bg-gray-200 transition duration-300"
              >
                <h3 className="font-semibold">{detail.label}:</h3>
                <p>{detail.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            {recipe.name}
          </h1>
          <p className="text-gray-700 mb-4">{recipe.description}</p>

          <div className="mb-4 h-64 overflow-auto bg-gray-50 p-4 rounded-lg shadow-md transition-transform duration-300 hover:bg-gray-200">
            <h2 className="text-2xl font-semibold">*Ingredients:*</h2>
            <pre className="whitespace-pre-line">{recipe.ingredients}</pre>
          </div>

          <div className="mb-4 h-64 bg-gray-50 p-4 rounded-lg shadow-md transition-transform duration-300 hover:bg-gray-200 overflow-auto">
            <h2 className="text-2xl font-semibold">*Method:*</h2>
            <pre className="whitespace-pre-line">{recipe.method}</pre>
          </div>
        </div>
      </div>

      <div className="mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-poppins font-semibold">
          Rate and Review this Recipe:
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col">
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-2xl ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full h-24 p-2 border rounded-lg mb-4"
            required
          />
          <button
            type="submit"
            className="bg-black border-2 hover:border-black font-poppins text-white py-2 px-4 rounded hover:bg-white hover:text-black transition"
          >
            Submit Rating and Review
          </button>
        </form>

        <div className="mt-6">
          <h2 className="text-xl font-poppins font-semibold mb-4">
            User Reviews:
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white shadow-md p-4 rounded-lg mb-4 transition-transform duration-300 hover:scale-101"
              >
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {Array.from({ length: review.rating }, (_, index) => (
                      <span key={index} className="text-yellow-500 text-lg">
                        ★
                      </span>
                    ))}
                    {Array.from({ length: 5 - review.rating }, (_, index) => (
                      <span key={index} className="text-gray-300 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    by {review.reviewerName}
                  </span>
                </div>
                <p className="text-gray-700">{review.text}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <span>
                    Reviewed on:{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default RecipeDetail;
