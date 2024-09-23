import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Route } from "react-router-dom";
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);
