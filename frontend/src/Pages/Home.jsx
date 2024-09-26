import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MyLoader from "../components/Loader";
import apiClient from "../services/apiClient";
import RecipeCard from "../components/RecipeCard";

const Home = () => {
  const [topRecipes, setTopRecipes] = useState([]);
  const [followedRecipes, setFollowedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dietaryPreferences: "",
    difficulty: "",
    preparationTime: "",
  });
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const [topResponse, followedResponse] = await Promise.all([
          apiClient.get("/recipes/all"),
          apiClient.get("/recipes/followed", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setTopRecipes(topResponse.data.data);
        setFollowedRecipes(followedResponse.data.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // debounced search
  const handleSearch = (e) => {
    clearTimeout(timeoutId);
    const timeout = setTimeout(async () => {
      try {
        const response = await apiClient.get(
          `/recipes/search?name=${e.target.value}`
        );
        setTopRecipes(response.data.data);
      } catch (error) {
        console.error("Error searching recipes:", error);
      }
    }, 400);
    setTimeoutId(timeout);
  };

  const handleFilters = async () => {
    try {
      const response = await apiClient.get(
        `/recipes/filter?dietaryPreferences=${filters.dietaryPreferences}&difficulty=${filters.difficulty}&preparationTime=${filters.preparationTime}`
      );
      setTopRecipes(response.data.data);
    } catch (error) {
      console.error("Error filtering recipes:", error);
    }
  };

  if (loading) return <MyLoader />;

  return (
    <>
      <Navbar />
      <div className="mt-32 font-poppins flex flex-col md:flex-row gap-16 px-12 md:px-10">
        <div className="md:w-4/5 w-full">
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-4">Top Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {topRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-4 text-indigo-700">
              Recipes from People You Follow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedRecipes && followedRecipes.length === 0 ? (
                <p className="text-lg text-gray-500">No recipes found</p>
              ) : (
                followedRecipes?.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                )) || null
              )}
            </div>
          </section>
        </div>

        <div className="md:w-1/4  mt-6 w-full">
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Search Or Sort</h2>
            <input
              type="text"
              placeholder="Search recipes..."
              onChange={(e) => handleSearch(e)}
              className="border rounded p-2 w-full mb-4"
            />

            <select
              value={filters.dietaryPreferences}
              onChange={(e) =>
                setFilters({ ...filters, dietaryPreferences: e.target.value })
              }
              className="border rounded p-2 w-full mb-4"
            >
              <option value="">Dietary Preferences</option>
              <option value="non-vegetarian">Non-Veg</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
            <select
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({ ...filters, difficulty: e.target.value })
              }
              className="border rounded p-2 w-full mb-4"
            >
              <option value="">Difficulty Level</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input
              type="text"
              placeholder="Preparation Time (e.g., 30 minutes)"
              value={filters.preparationTime}
              onChange={(e) =>
                setFilters({ ...filters, preparationTime: e.target.value })
              }
              className="border rounded p-2 w-full mb-4"
            />

            <button
              onClick={handleFilters}
              className="bg-blue-500 text-white rounded p-2 w-full"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
