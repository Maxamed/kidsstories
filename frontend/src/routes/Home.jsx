import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Page.css";
import bg from "../assets/bg-2.png";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <Navbar />
            <img src={bg} alt="background" className="bg-img" />
            <h1 class="title-page">GENERATE STORY</h1>
            <div class="generate-story">
                <p class="generate-story-title">Tell us about your child</p>
                <input
                    type="text"
                    class="generate-story-input"
                    placeholder="Enter your child's name"
                />
                <input
                    type="text"
                    class="generate-story-input"
                    placeholder="Enter your child's age"
                />
                <input
                    type="text"
                    class="generate-story-input"
                    placeholder="Enter the moral of the story"
                />
                <Link class="generate-story-button" to="/story">
                    Generate Story
                </Link>
            </div>
        </>
    );
};

export default Home;
