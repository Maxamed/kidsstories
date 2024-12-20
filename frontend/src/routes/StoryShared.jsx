import React, { useState, useEffect } from "react";
import MyNavbar from "../components/MyNavbar";
import { useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import axios from "axios";

const Story = () => {
    const [storyData, setStoryData] = useState({});
    const [message, setMessage] = useState("Loading story...");
    const { id } = useParams();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL;

    const fetchStory = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/story/shared/${id}`, { withCredentials: true });
            const storyRes = response.data.story;
            const paragraphs = storyRes.content.split("\n");
            const imageURL = `${ASSETS_BASE_URL}/images/${storyRes.image}`;
            setStoryData({ ...storyRes, paragraphs, imageURL });
            setMessage("");
        } catch (error) {
            console.error(error);
            setMessage("Story not found or is not shared publicly!");
        }
    };

    useEffect(() => {
        fetchStory();
    }, []);

    return (
        <Container fluid className="p-0 bg-container bg-3">
            <MyNavbar />
            <Container className="text-center mt-5 pb-5">
                <h1 className="text-blue-900 fw-900">SHARED STORY</h1>
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={8}>
                        <div className="card-container mt-4 p-sm-5 p-4 py-5">
                            <h2 className="my-card-title mb-5">Register now to create your own stories!</h2>

                            {message ? (
                                <h4 className="my-card-title my-4">{message}</h4>
                            ) : (
                                <div className="story-preview-content mb-4 p-4">
                                    <h4 id="story-title" className="my-card-title my-3">{storyData?.title}</h4>
                                    {storyData?.paragraphs.map((para, index) => (
                                        <React.Fragment key={index}>
                                            {index === Math.floor(storyData.paragraphs.length / 3) && (
                                                <img
                                                    src={storyData?.imageURL}
                                                    alt="Story Image"
                                                    className="float-lg-end story-preview-image my-2 ms-lg-5"
                                                />
                                            )}
                                            <p
                                                className="story-preview-content-text"
                                                key={index}
                                            >{para}</p>
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container >
        </Container >
    )
}

export default Story;