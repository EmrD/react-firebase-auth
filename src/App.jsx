import { Route, Routes } from "react-router-dom";
import React from "react";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import MainPage from "./pages/mainpage.jsx";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mainpage" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;
