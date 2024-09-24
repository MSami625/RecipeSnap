import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import SignupConfirmation from "../components/notificationToast";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  const Links = [
    { name: "Home", path: "/" },
    { name: "Share a Recipe", path: "/recipeshare" },
    { name: "Authors", path: "/authors" },
    { name: "Favourites", path: "/favourites" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    setIsMenuOpen(false);
    navigate("/signin");
  };

  const handleLinkClick = (path) => {
    if (
      !isLogged &&
      (path === "/recipeshare" || path === "/profile" || path === "/favourites")
    ) {
      setConfirmation({
        status: "fail",
        message: "Please sign in to Access! Redirecting to Sign In",
      });
    } else {
      navigate(path);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleModal = () => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      {confirmation && confirmation.status === "fail" && (
        <SignupConfirmation
          message={confirmation}
          onClose={() => setConfirmation("")}
          redirectPath="/signin"
        />
      )}
      <div className="fixed font-poppins top-0 left-0 right-0 bg-[#765b40] shadow-lg rounded-b-xl px-4 pt-4 pb-2 flex items-center justify-between z-50">
        <div className="flex items-center">
          <a href="/">
            <img src={Logo} alt="Logo" className="h-14 w-auto" />
          </a>
        </div>

        <div className="hidden lg:flex space-x-20">
          {Links.map((link) => (
            <span
              key={link.name}
              onClick={() => handleLinkClick(link.path)}
              className="bg-transparent border-yellow-400 border-2 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out hover:bg-[#dcdcdc] hover:text-black hover:border-transparent cursor-pointer"
            >
              {link.name}
            </span>
          ))}
        </div>

        <div className="hidden lg:block relative">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-12 h-auto rounded-full border-2 border-gray-300 cursor-pointer hover:shadow-md transition duration-300"
            onClick={toggleModal}
          />
          {isModalOpen && (
            <div className="absolute right-0 bg-white text-black rounded-lg w-40 shadow-lg p-4 mt-2 z-10">
              <ul className="space-y-2 w-full">
                <li>
                  <span
                    onClick={() => handleLinkClick("/profile")}
                    className="hover:text-blue-500 transition duration-300 cursor-pointer"
                  >
                    Profile
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => handleLinkClick("/adminsignin")}
                    className="hover:text-blue-500 transition duration-300 cursor-pointer"
                  >
                    Admin Sign In
                  </span>
                </li>
                <li>
                  <span
                    onClick={handleLogout}
                    className="hover:text-blue-500 transition duration-300 cursor-pointer"
                  >
                    {isLogged ? "Logout" : "Sign In"}
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-[71px] left-0 right-0 bg-[#765b40] rounded-b-2xl shadow-lg pt-4 pb-4 px-4 flex flex-col space-y-2">
            {Links.map((link) => (
              <span
                key={link.name}
                onClick={() => handleLinkClick(link.path)}
                className="bg-transparent border-yellow-400 border-2 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out hover:bg-[#dcdcdc] hover:text-black hover:border-transparent cursor-pointer"
              >
                {link.name}
              </span>
            ))}

            <div className="flex flex-col space-y-2">
              {isLogged ? (
                <>
                  <span
                    onClick={() => handleLinkClick("/profile")}
                    className="bg-transparent border-yellow-400 border-2 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out hover:bg-[#dcdcdc] hover:text-black hover:border-transparent cursor-pointer"
                  >
                    Profile
                  </span>
                  <span
                    onClick={() => handleLinkClick("/adminsignin")}
                    className="bg-transparent border-yellow-400 border-2 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out hover:bg-[#dcdcdc] hover:text-black hover:border-transparent cursor-pointer"
                  >
                    Admin Sign In
                  </span>
                  <span
                    onClick={handleLogout}
                    className="bg-transparent border-yellow-400 border-2 text-white font-semibold py-2 px-4 rounded-full shadow-lg cursor-pointer transition duration-300 ease-in-out hover:bg-[#dcdcdc] hover:text-black hover:border-transparent text-center"
                  >
                    Logout
                  </span>
                </>
              ) : (
                <span
                  onClick={() => {
                    navigate("/signin");
                    setIsMenuOpen(false);
                  }}
                  className="bg-transparent border-yellow-400 border-2 text-white font-semibold py-2 px-4 rounded-full shadow-lg cursor-pointer transition duration-300 ease-in-out hover:bg-[#dcdcdc] hover:text-black hover:border-transparent text-center"
                >
                  Sign In
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
