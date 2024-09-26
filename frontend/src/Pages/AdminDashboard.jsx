import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import MyLoader from "../components/Loader";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [recipeSearch, setRecipeSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/adminsignin");
      return;
    }

    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.isAdmin !== "admin") {
        navigate("/adminsignin");
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/authors", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchRecipes = async () => {
      try {
        const response = await apiClient.get("recipes/all");
        setRecipes(response.data.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchUsers();
    fetchRecipes();
  }, []);

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/adminsignin");
    }
    try {
      await apiClient.delete(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/signin");
    }
    try {
      await apiClient.delete(`/recipe/${recipeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(recipeSearch.toLowerCase())
  );

  if (users.length === 0 || recipes.length === 0) {
    return <MyLoader />;
  }

  return (
    <>
      <Navbar />
      <div className="admin-dashboard p-4 md:p-10 bg-gray-50 min-h-screen font-poppins">
        <h1 className="text-3xl font-bold mb-6 text-black">Admin Dashboard</h1>
        <p className="mb-4 text-lg text-gray-600">
          Welcome, Admin! Manage users and recipes efficiently.
        </p>

        <section className="mb-10 bg-white shadow-md rounded-lg p-4 md:p-6 border border-gray-300">
          <h2 className="text-2xl font-bold mb-4 text-black">Manage Users</h2>
          <input
            type="text"
            placeholder="Search Users"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="border rounded p-2 mb-4 w-full"
          />
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-sm md:text-base">
                  <td className="border text-indigo-600 font-semibold px-4 py-2">
                    <Link to={`/author/${user.id}`}>{user.name}</Link>
                  </td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">Manage Recipes</h2>
          <input
            type="text"
            placeholder="Search Recipes"
            value={recipeSearch}
            onChange={(e) => setRecipeSearch(e.target.value)}
            className="border rounded p-2 mb-4 w-full"
          />
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Author Name</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe) => (
                <tr key={recipe.id} className="text-sm md:text-base">
                  <td className="border text-indigo-600 font-semibold px-4 py-2">
                    <Link to={`/recipe/${recipe.id}/${recipe.name}`}>
                      {recipe.name}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{recipe.ownerName}</td>
                  <td className="border px-4 py-2">{recipe.description}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="text-red-600 hover:text-red-800 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
};

export default AdminDashboard;
