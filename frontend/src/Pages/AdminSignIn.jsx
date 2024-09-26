import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const AdminSignIn = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/admin/signin", credentials);
      localStorage.clear();
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-signin-page min-h-screen flex items-center font-poppins justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full border border-gray-300">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Admin Sign In
          </h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="border border-gray-400 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="border border-gray-400 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className={`bg-black border-2 text-white py-2 px-4 rounded transition duration-300 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : " hover:bg-white hover:text-black border-2 hover:border-black"
              }`}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <Link to="/admin/dashboard" className="block mt-4 text-blue-700">
            Logged In Already? Admin Dashboard
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminSignIn;
