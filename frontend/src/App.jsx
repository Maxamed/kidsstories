import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import AboutUs from "./routes/AboutUs";
import History from "./routes/History";
import Pricing from "./routes/Pricing";
import Story from "./routes/Story";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="history" element={<History />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="story" element={<Story />} />
        </Routes>
    );
}

export default App;
