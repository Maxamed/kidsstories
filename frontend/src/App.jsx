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
import PageNotFound from "./routes/PageNotFound";

import Login from "./routes/Login";
import Register from "./routes/Register";

import MyStories from "./routes/MyStories";
import GeneratePreview from "./routes/GeneratePreview";
import Story from "./routes/Story";
import StoryShared from "./routes/StoryShared";

import AdminDashboard from "./routes/admin/AdminDashboard";
import AdminUser from "./routes/admin/AdminUser";
import AdminUserView from "./routes/admin/AdminUserView";
import AdminStory from "./routes/admin/AdminStory";
import AdminStoryView from "./routes/admin/AdminStoryView";
import AdminFeedback from "./routes/admin/AdminFeedback";
import AdminFeedbackView from "./routes/admin/AdminFeedbackView";
import AdminContact from "./routes/admin/AdminContact";
import AdminContactView from "./routes/admin/AdminContactView";

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
            <Route path="/story/shared/:id" element={<StoryShared />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/user" element={<AdminUser />} />
            <Route path="/admin/user/:id" element={<AdminUserView />} />
            <Route path="/admin/story" element={<AdminStory />} />
            <Route path="/admin/story/:id" element={<AdminStoryView />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/admin/feedback/:id" element={<AdminFeedbackView />} />
            <Route path="/admin/contact" element={<AdminContact />} />
            <Route path="/admin/contact/:id" element={<AdminContactView />} />

            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default App;
