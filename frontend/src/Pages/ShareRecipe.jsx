import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import SignupConfirmation from "../components/notificationToast.jsx";
import { useNavigate } from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';

const ShareRecipe = () => {
  const navigateTo = useNavigate();
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [method, setMethod] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [mainIngredient, setMainIngredient] = useState("");
  const [recipeType, setRecipeType] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [marinationTime, setMarinationTime] = useState("");
  const [soakingTime, setSoakingTime] = useState("");
  const [serves, setServes] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [tags, setTags] = useState("");
  const [keywords, setKeywords] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [sharedRecipes, setSharedRecipes] = useState([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [fetchedRecipes, setFetchedRecipes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  ****change here to toast
    if (!acceptTerms) {
      toast.warning("You must accept the terms and conditions.");
      return;
    }

    // Check if the image file is provided
    if (!imageFile) {
       toast.warning("Please upload an image file to share a recipe.");
      return;
    }

    // multipart form data
    const formData = new FormData();
    formData.append("name", recipeName);
    formData.append("description", description);
    formData.append("ingredients", ingredients);
    formData.append("method", method);
    formData.append("cuisine", cuisine);
    formData.append("mainIngredient", mainIngredient);
    formData.append("recipeType", recipeType);
    formData.append("cookingTime", cookingTime);
    formData.append("preparationTime", preparationTime);
    formData.append("marinationTime", marinationTime);
    formData.append("soakingTime", soakingTime);
    formData.append("serves", serves);
    formData.append("otherNames", otherNames);
    formData.append("tags", tags);
    formData.append("keywords", keywords);
    formData.append("source", source);
    formData.append("notes", notes);
    formData.append("image", imageFile);

    const token = localStorage.getItem("token");

    try {
      // ****change here to toast
      if (!token) {
        alert("You must be logged in to share a recipe.");
        return;
      }

      const response = await apiClient.post("/recipe/store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "fail") {
       toast.error(response.data.message);
        return;
      }

      const result = response.data;
      console.log(result.message);

      setConfirmation(result.message);
      setSharedRecipes((prevRecipes) => [...prevRecipes, result.data]);
      toast.success("Recipe shared successfully!");
      resetForm();
    } catch (error) {
      console.error("Error submitting recipe:", error);
      setConfirmation("Error sharing recipe. Please try again.");
    }
  };

  const resetForm = () => {
    setRecipeName("");
    setDescription("");
    setIngredients("");
    setMethod("");
    setCuisine("");
    setMainIngredient("");
    setRecipeType("");
    setCookingTime("");
    setPreparationTime("");
    setMarinationTime("");
    setSoakingTime("");
    setServes("");
    setOtherNames("");
    setTags("");
    setKeywords("");
    setSource("");
    setNotes("");
    setImageFile(null);
    setAcceptTerms(false);
  };

  //get users shared recipes on page render

  useEffect(() => {
    const token = localStorage.getItem("token");
    // ******* change here to toast
    if (!token) {
      navigateTo("/signin");
      return;
    }

    const fetchSharedRecipes = async () => {
      try {
        const response = await apiClient.get("/recipes/myrecipes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status === "fail") {
          alert(response.data.message);
          return;
        }

        const result = response.data;

        setFetchedRecipes(result.data);
      } catch (error) {
        console.error("Error fetching shared recipes:", error);
      }
    };

    fetchSharedRecipes();
  }, [sharedRecipes]);

  return (
    <div>
      <ToastContainer />
      {confirmation.status === "success" && (
        <SignupConfirmation message={confirmation} />
      )}

      {confirmation.status === "fail" && (
        <SignupConfirmation message={confirmation} />
      )}
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-20 bg-white shadow-lg rounded-lg font-poppins">
        <h1 className="text-3xl font-bold font-poppins text-center mb-6">
          Share Your Recipe
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ul className="space-y-4">
            <li>
              <input
                type="text"
                placeholder="Recipe Name (*)"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </li>
            <li>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows="3"
              />
            </li>
            <li>
              <textarea
                placeholder={`Ingredients (*)\n1. E.g., 2 cups dried hibiscus flowers\n2. 2 quarts water\n3. 1/2 cup sugar per pitcher of jamaica`}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows="4"
                required
              />
            </li>
            <li>
              <textarea
                placeholder={`Method (*)\n1. E.g., HIBISCUS CONCENTRATE\n2. Put 2 quarts of water in a pot\n3. Add 2 cups of dried hibiscus flowers to the water\n4. Bring to a boil\n5. Reduce the heat to low and simmer for 10 minutes\n6. Allow to cool`}
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows="4"
                required
              />
            </li>
            <li>
              <input
                type="text"
                placeholder="Cuisine (*)"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </li>
            <li>
              <select
                value={mainIngredient}
                onChange={(e) => setMainIngredient(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Select Main Ingredient (**)</option>
                <option value="Beans/Pulses">Beans/Pulses</option>
                <option value="Beef">Beef</option>
                <option value="Cheese/Paneer/Tofu">Cheese/Paneer/Tofu</option>
                <option value="Chicken">Chicken</option>
                <option value="Dairy">Dairy</option>
                <option value="Duck/Goose">Duck/Goose</option>
                <option value="Egg">Egg</option>
                <option value="Fish">Fish</option>
                <option value="Flour">Flour</option>
                <option value="Fruits">Fruits</option>
                <option value="Lamb/Mutton">Lamb/Mutton</option>
                <option value="Pasta">Pasta</option>
                <option value="Potatoes">Potatoes</option>
                <option value="Rabbit/Venison">Rabbit/Venison</option>
                <option value="Rice">Rice</option>
                <option value="Seafood">Seafood</option>
                <option value="Semolina/Wheat">Semolina/Wheat</option>
                <option value="Turkey/Quail">Turkey/Quail</option>
                <option value="Vegetables">Vegetables</option>
              </select>
            </li>
            <li>
              <select
                value={recipeType}
                onChange={(e) => setRecipeType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Select Recipe Type (**)</option>
                <option value="Baking">Baking</option>
                <option value="Beverages">Beverages</option>
                <option value="Bread">Bread</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Dessert">Dessert</option>
                <option value="Dinner">Dinner</option>
                <option value="Lunch">Lunch</option>
                <option value="Quick Meal">Quick Meal</option>
                <option value="Salad">Salad</option>
                <option value="Sauce / Chutney">Sauce / Chutney</option>
                <option value="Snack">Snack</option>
                <option value="Soup">Soup</option>
                <option value="Special Occasion">Special Occasion</option>
              </select>
            </li>
          </ul>

          <ul className="space-y-4 mt-4">
            <li>
              <select
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Cooking Time (e.g., 20 mins)</option>
                <option value="10 mins">10 mins</option>
                <option value="20 mins">20 mins</option>
                <option value="30 mins">30 mins</option>
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
                <option value="3-4 hours">3-4 hours</option>
              </select>
            </li>
            <li>
              <select
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Preparation Time (e.g., 15 mins)</option>
                <option value="10 mins">10 mins</option>
                <option value="15 mins">15 mins</option>
                <option value="30 mins">30 mins</option>
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
              </select>
            </li>
            <li>
              <select
                value={marinationTime}
                onChange={(e) => setMarinationTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Marination Time (e.g., 1 hour)</option>
                <option value="30 mins">30 mins</option>
                <option value="1 hour">1 hour</option>
                <option value="1 hour">2 hour</option>
                <option value="3-4 hours">3-4 hours</option>
                <option value="Overnight">Overnight</option>
              </select>
            </li>
            <li>
              <select
                value={soakingTime}
                onChange={(e) => setSoakingTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Soaking Time (e.g., 2 hours)</option>
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
                <option value="3-4 hours">3-4 hours</option>
                <option value="Overnight">Overnight</option>
              </select>
            </li>
            <li>
              <input
                type="text"
                placeholder="Serves"
                value={serves}
                onChange={(e) => setServes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </li>
            <li>
              <input
                type="text"
                placeholder="Other Names"
                value={otherNames}
                onChange={(e) => setOtherNames(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </li>
            <li>
              <input
                type="text"
                placeholder="Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </li>
            <li>
              <input
                type="text"
                placeholder="Keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </li>
            <li>
              <input
                type="text"
                placeholder="Source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </li>
            <li>
              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows="3"
              />
            </li>
            <li>
              <label htmlFor="image" className="block font-semibold">
                Choose Recipe Image
              </label>
              <input
                type="file"
                accept="image/*"
                required
                id="image"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </li>
            <li>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="mr-2"
                  required
                />
                <label>
                  I accept the{" "}
                  <Link to="/termsandconditions" className="text-yellow-600">
                    terms and conditions
                  </Link>
                  .
                </label>
              </div>
            </li>
          </ul>

          <button
            type="submit"
            className="w-full bg-black border-slate-300 border-2 text-white font-semibold py-3 rounded shadow-lg hover:bg-white hover:text-black transition duration-300 hover:border-2 hover:border-black"
          >
            Share Recipe
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Fields marked with (*) are compulsory. Main Ingredient and Recipe Type
          are marked with (**) and are also required.
        </p>
      </div>
      <hr className="my-10 border-black" />
      <h2 className="text-3xl font-bold font-poppins text-center mb-6 mt-16">
        Your Shared Recipes
      </h2>

      {fetchedRecipes.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-lg p-6">
          <p className="text-xl font-semibold text-gray-700 mb-4">
            No Recipes Shared
          </p>
          <p className="text-gray-500">
            It seems there are no recipes available at the moment.
          </p>
        </div>
      )}

      <div className="w-full bg-gray-100 p-10 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {fetchedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareRecipe;
