import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/signin");
    return;
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }

    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await apiClient.put(
        "/user",
        { name: user.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        await apiClient.delete(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Account deleted successfully.");
        localStorage.removeItem("token");
        navigate("/");
      } catch (error) {
        console.error("Error deleting account:", error);
        setMessage("Failed to delete account.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-page mt-32 p-10 bg-gray-50 min-h-screen font-poppins">
        <h1 className="text-3xl font-bold mb-6 text-black">Profile</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 border border-gray-300"
        >
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-semibold">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="border border-gray-400 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
              disabled={!isEditing}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              className="border border-gray-400 rounded p-3 w-full bg-gray-200 cursor-not-allowed"
              disabled
            />
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="bg-black border-2 text-white py-2 px-4 rounded transition duration-300 hover:bg-white hover:text-black hover:border-black mr-4"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            {isEditing && (
              <button
                type="submit"
                className="bg-lime-600 text-white py-2 px-4 rounded transition duration-300 hover:bg-white hover:text-black border-2 hover:border-black"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>

        {message && <p className="mt-4 text-green-600">{message}</p>}

        <button
          onClick={handleDeleteAccount}
          className="mt-6 bg-red-600 text-white py-2 px-4 rounded transition duration-300 hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </>
  );
};

export default Profile;
