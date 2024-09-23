// src/SignUp.js
import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import SignupConfirmation from "../components/notificationToast";

const SignUp = () => {
  const [focusedInput, setFocusedInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = (inputName) => {
    if (inputName === "name" && name === "") {
      setFocusedInput("");
    }
    if (inputName === "email" && email === "") {
      setFocusedInput("");
    }
    if (inputName === "password" && password === "") {
      setFocusedInput("");
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post("/user/signup", {
        name,
        email,
        password,
      });

      setName("");
      setEmail("");
      setPassword("");
      setFocusedInput("");
      setConfirmation(response.data);
    } catch (err) {
      setName("");
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

  return (
    <div className="flex font-poppins items-center justify-center min-h-screen bg-gray-100 transition-all duration-200">
      {confirmation.status === "success" && (
        <SignupConfirmation
          message="Account created successfully, Redirecting to SignIn page"
          redirectPath="/signin"
          onClose={() => setConfirmation("")}
        />
      )}

      {confirmation.status === "fail" && (
        <SignupConfirmation
          message={{ status: "fail", message: confirmation.message }}
          onClose={() => setConfirmation("")}
        />
      )}

      <div className="m-[5vw] w-full max-w-md p-8 space-y-10 bg-white rounded-lg shadow-md">
        <div className="flex gap-3 justify-start items-center">
          <img className="h-12" src={Logo} alt="Recipe Snap Logo" />
          <h2 className="text-3xl font-medium">Sign Up</h2>
        </div>
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
          <div className="relative mb-4">
            <input
              type="text"
              id="name"
              required
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
              className={`block mb-6 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-blue-500 border-x-4`}
            />
            <label
              htmlFor="name"
              className={`absolute left-4 transition-all duration-200 ${
                focusedInput === "name" || name
                  ? "-top-4 text-blue-500 text-xs"
                  : "top-3 text-gray-500 "
              }`}
            >
              Name
            </label>
          </div>

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
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              className={`block mb-5 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-blue-500 border-x-4`}
            />
            <label
              htmlFor="password"
              className={`absolute left-4 transition-all duration-200 ${
                focusedInput === "password" || password
                  ? "-top-4 text-blue-500 text-xs"
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
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-semibold text-lg text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
