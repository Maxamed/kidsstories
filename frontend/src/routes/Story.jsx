import React from "react";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import "../styles/Page.css";
import bg from "../assets/bg-2.png";
import { Link } from "react-router-dom";

const Story = () => {
    return (
        <>
            <Navbar />
            <img src={bg} alt="background" className="bg-img" />
            <h1 class="title-page">STORY PREVIEW</h1>
            <div class="story-preview">
                <p class="story-preview-status">Your child's story is currently being generated...</p>
                <ProgressBar bgcolor="#f5b700" completed="70" />
                <div class="story-preview-content hide-story">
                    <p class="story-preview-content-title">The Brave Little Mark</p>
                    <p class="story-preview-content-text">Mark was a cheerful 6-year-old boy who loved exploring. Every day after school, he imagined himself as a brave knight or a daring adventurer in his backyard. One sunny afternoon, while playing, he heard a faint meowing sound. Following the sound, Mark found a tiny kitten stuck high up in a tree. The kitten was scared and couldn’t climb down.
                    </p>
                    <p class="story-preview-content-text">Mark wanted to help, but the tree was tall, and he felt afraid. For a moment, he thought about calling his parents, but then he remembered what his dad always said: "Being brave means facing your fears to help others." Mark took a deep breath, determined to save the kitten.
                    </p>
                </div>
                <div class="call-to-register">Register for free to read the full story!</div>
                <Link class="call-to-register-button" to="/register">Register
                </Link>
            </div>
        </>
    )
}

export default Story