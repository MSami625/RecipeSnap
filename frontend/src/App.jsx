import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import ShareRecipe from "./Pages/ShareRecipe";
import TermsAndConditions from "./Pages/TermsAndConditions";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
