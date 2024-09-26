import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import ShareRecipe from "./Pages/ShareRecipe";
import TermsAndConditions from "./Pages/TermsAndConditions";
import RecipeDetails from "./Pages/RecipeDetails";
import EditRecipe from "./Pages/EditRecipe";
import Authors from "./Pages/Authors";
import AuthorDetails from "./Pages/AuthorDetails";
import Profile from "./Pages/Profile";
import Favorite from "./Pages/Favorite";
import AdminSignIn from "./Pages/AdminSignIn";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Home />} />
          <Route path="/recipeshare" element={<ShareRecipe />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="/recipe/:id/:name" element={<RecipeDetails />} />
          <Route path="/recipe/:id/:name/edit" element={<EditRecipe />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/author/:authorId" element={<AuthorDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/adminsignin" element={<AdminSignIn />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
