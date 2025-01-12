import React, { useState, useEffect } from "react";
import MyNavbar from "../components/MyNavbar";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useAuth } from "../context/AuthContext";

import axios from "axios";

const MyStories = () => {
    const { user } = useAuth();
    const [storyList, setStoryList] = useState([]);
    const [message, setMessage] = useState("Loading stories...");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL;

    const fetchStories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/story/my-stories`, { withCredentials: true });
            const stories = response.data.stories;

            if (stories.length === 0) {
                setMessage("No stories found! Generate one now!");
            } else {
                setMessage("");
            }
            setStoryList(stories);
        } catch (error) {
            console.error(error);
            setMessage("An error occurred while fetching your stories.");
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        if (!user) {
            setMessage("Please log in to view your stories.");
            return;
        };
        fetchStories();
    }, []);

    return (
        <Container fluid className="p-0 bg-container bg-3">
            <MyNavbar />
            <Container className="text-center mt-5 pb-5">
                <h1 className="text-blue-900 fw-900">MY STORIES</h1>
                <Row className="justify-content-center">
                    <Col xs={12} md={12} lg={12}>
                        <div className="card-container mt-4 p-4">
                            {message && <h4 className="my-card-title my-4">{message}</h4>}
                            {message === "No stories found! Generate one now!" && (
                                <Link to="/" className="call-to-register-button px-5 py-1">Generate</Link>
                            )}
                            {storyList.length > 0 && (
                                <Row className="g-4">
                                    {storyList.map((story, index) => (
                                        <Col key={index} xs={12} md={6} lg={4} className="d-flex justify-content-center">
                                            <Link to={`/story/${story.id}`} className="no-link-style">
                                                <div className="story-preview-content p-3 h-100 d-flex flex-column justify-content-center align-items-center">
                                                    <img
                                                        src={`${ASSETS_BASE_URL}/images/${story.image}`}
                                                        alt={story.title}
                                                        className="story-preview-image"
                                                    />
                                                    <h5 className="my-card-title mt-3">{story.title}</h5>
                                                    <p className="story-preview-content-text">
                                                        {story.content}
                                                    </p>
                                                    <p className="story-preview-content-text">
                                                        Created on: {formatDate(story.timestamp)}
                                                    </p>
                                                </div>
                                            </Link>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container >
    );
};

export default MyStories;
