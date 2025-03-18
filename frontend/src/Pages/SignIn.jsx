import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import SignupConfirmation from "../components/notificationToast";

const SignIn = () => {
  const [focusedInput, setFocusedInput] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = (inputName) => {
    if (inputName === "email" && email === "") {
      setFocusedInput("");
    }
    if (inputName === "password" && password === "") {
      setFocusedInput("");
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/user/signin", {
        email,
        password,
      });

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
      }

      setEmail("");
      setPassword("");
      setFocusedInput("");
      setConfirmation(response.data);
    } catch (err) {
      setEmail("");
      setPassword("");
      setFocusedInput("");
      setConfirmation({
        status: "fail",
        message:
          err.response?.data?.message || "An error occurred. Please try again.",
      });
    }
  };

  // Function to fill the dummy credentials
  const fillDummyCredentials = () => {
    setEmail("test@example.us");
    setPassword("test");
  };

  return (
    <div className="flex font-poppins items-center justify-center min-h-screen bg-gray-100">
      {confirmation.status === "success" && (
        <SignupConfirmation
          message="Sign In successful, Redirecting to Dashboard"
          redirectPath="/"
          onClose={() => setConfirmation("")}
        />
      )}

      {confirmation.status === "fail" && (
        <SignupConfirmation
          message={{ status: "fail", message: confirmation.message }}
          onClose={() => setConfirmation("")}
        />
      )}

      <div className="m-[5vw] w-full max-w-md p-8 space-y-10 bg-white rounded-2xl   shadow-md">
        <div className="flex gap-3 justify-start items-center">
          <img className="h-12" src={Logo} alt="Recipe Snap Logo" />
          <h2 className="text-3xl font-medium">Sign In</h2>
        </div>
        <form onSubmit={handleSignInSubmit} className="space-y-4">
          <div className="relative mb-4">
            <input
              type="email"
              id="email"
              required
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              className={`block mb-6 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-blue-500 border-x-4`}
            />
            <label
              htmlFor="email"
              className={`absolute left-4 transition-all duration-200 ${
                focusedInput === "email" || email
                  ? "-top-4 text-blue-500 text-xs"
                  : "top-3 text-gray-500"
              }`}
            >
              Email
            </label>
          </div>

          <div className="relative mb-4">
            <input
              type="password"
              id="password"
              required
              placeholder=" "
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              className={`block w-full mb-5 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-blue-600 border-x-4`}
            />
            <label
              htmlFor="password"
              className={`absolute left-4 transition-all duration-200 ${
                focusedInput === "password" || password
                  ? "-top-5  text-blue-500 text-sm"
                  : "top-3 text-gray-500"
              }`}
            >
              Password
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign In
          </button>

        
          <button
            type="button"
            onClick={fillDummyCredentials}
            className="w-full py-2 mt-4 text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Fill Dummy Credentials
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-lg text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
