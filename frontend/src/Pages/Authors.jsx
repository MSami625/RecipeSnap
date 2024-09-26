import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import chefImg from "../assets/chef.png";
import { useNavigate } from "react-router-dom";

const Authors = () => {
  const [authors, setAuthors] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchAuthors = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await apiClient.get("/authors", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAuthors(response.data.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchAuthors();
  }, []);

  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    var currentUserId = decodedToken.userId;
  }

  return (
    <>
      <Navbar />
      <div className="authors-list mt-20 p-10 bg-gray-100 min-h-screen font-poppins">
        <h1 className="text-4xl font-bold text-center mb-8 text-black font-poppins">
          Authors
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {authors.map((author) => (
            <div
              key={author.id}
              className="bg-white  shadow-lg rounded-lg p-6 transition-transform transform hover:scale-[1.02] hover:shadow-xl border border-gray-200"
            >
              <Link
                className="flex gap-10 items-center"
                to={`/author/${author.id}`}
              >
                <img
                  src={chefImg}
                  alt={author.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-black">
                    {author.name} {currentUserId === author.id && "(You)"}
                  </h2>
                  <p className="text-gray-600">{author.email}</p>
                  <p className="text-gray-500">
                    Joined: {new Date(author.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Authors;
