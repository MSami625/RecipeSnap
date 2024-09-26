import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import chefImg from "../assets/chef.png";

const AuthorDetails = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const currentUserId = decodedToken.userId;
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        const response = await apiClient.get(`/authors/${authorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setAuthor(response.data.data.author);
        setRecipes(response.data.data.recipes);
        setIsFollowing(response.data.data.isFollowing);
      } catch (error) {
        console.error("Error fetching author details:", error);
      }
    };

    fetchAuthorDetails();
  }, [authorId]);

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    try {
      await apiClient.post(
        `/authors/${authorId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following author:", error);
    }
  };

  if (!author) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="author-details mt-32 p-10 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 flex items-center">
          <img
            src={chefImg}
            alt={`${author.name}'s profile`}
            className="rounded-full mr-4 border border-gray-300 w-24 h-24"
          />
          <div>
            <h1 className="text-4xl font-bold text-black flex items-center">
              {author.name} {currentUserId === author.id && "(You)"}
            </h1>
            <p className="text-gray-80 0 flex items-center">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="mr-2 text-indigo-700"
              />
              {author.email}
            </p>
            <p className="text-gray-600">
              Joined: {new Date(author.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={
                currentUserId === author.id
                  ? () => navigateTo(`/profile`)
                  : handleFollow
              }
              className={`mt-4 px-4 py-2 rounded text-white ${
                isFollowing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-white hover:text-black border-2 border-black"
              }`}
              disabled={isFollowing}
            >
              {currentUserId === author.id
                ? "Edit Profile"
                : isFollowing
                ? "Following"
                : "Follow"}
            </button>
          </div>
        </div>
        <h2 className="text-3xl font-semibold mb-4 text-gray-900 flex items-center">
          <FontAwesomeIcon icon={faUtensils} className="mr-2 text-indigo-700" />
          Shared Recipes ({recipes.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <Link
              to={`/recipe/${recipe.id}/${recipe.name}`}
              className="border rounded-lg overflow-hidden shadow-lg block transition-transform transform hover:scale-105"
              key={recipe.id}
            >
              <div className="p-4 h-full bg-white">
                <h3 className="font-bold text-xl">{recipe.name}</h3>
                {recipe.description.length > 105
                  ? recipe.description.slice(0, 105) + "..."
                  : recipe.description}

                <div className="flex justify-between items-center mt-4">
                  {recipe.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-500">
                        {"⭐".repeat(recipe.rating)}
                      </span>
                      <span className="text-gray-600 ml-1">
                        ({recipe.rating}) of 5
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mt-2">
                  <strong>Recipe Type:</strong>{" "}
                  <span className="text-green-600">{recipe.recipeType}</span>
                </p>
                <p className="text-gray-600">
                  <strong>Cuisine:</strong>{" "}
                  <span className="text-blue-600">{recipe.cuisine}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AuthorDetails;
