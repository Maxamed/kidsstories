import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.scss";
import { Routes, Route } from "react-router-dom";

import Home from "./routes/Home";
import AboutUs from "./routes/AboutUs";
import PrivacyPolicy from "./routes/PrivacyPolicy";
import TermsAndConditions from "./routes/TermsAndConditions";
import FAQ from "./routes/FAQ";
import Pricing from "./routes/Pricing";
import ContactUs from "./routes/ContactUs";

import Login from "./routes/Login";
import Register from "./routes/Register";

import MyStories from "./routes/MyStories";
import GeneratePreview from "./routes/GeneratePreview";
import Story from "./routes/Story";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact-us" element={<ContactUs />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/generate-preview" element={<GeneratePreview />} />
            <Route path="/my-stories" element={<MyStories />} />
            <Route path="/story/:id" element={<Story />} />
        </Routes>
    );
}

export default App;
