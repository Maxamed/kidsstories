import React, { useEffect } from "react";
import MyNavbar from "../components/MyNavbar";
import { Link, useNavigate } from "react-router-dom";

import { useStoryGenerate } from "../context/StoryGenerateContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const GeneratePreview = () => {
    const { storyResponse } = useStoryGenerate();
    const navigate = useNavigate();

    useEffect(() => {
        if (!storyResponse) {
            navigate("/")
        }
    }, [storyResponse]);

    return (
        <Container fluid className="p-0 bg-container bg-2">
            <MyNavbar />
            <Container className="text-center mt-5 pb-5">
                <h1 className="title-page">{storyResponse?.type === "partial" ? "TRIAL STORY PREVIEW" : "FULL STORY PREVIEW"}</h1>
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={8}>
                        <div className="card-container mt-4 p-5">
                            <h2 className="my-card-title">Your story preview is ready!</h2>
                            {storyResponse?.type === "full" && (
                                <h5 className="my-card-title"><br />View all your generated stories from "My Stories" page</h5>
                            )}
                            <div className={`story-preview-content mt-5 mb-4 p-4 ${storyResponse?.type === "partial" ? "hide-story" : ""}`}>
                                <h4 id="story-title" className="my-card-title my-3">{storyResponse?.title}</h4>
                                {storyResponse?.paragraphs.map((para, index) => (
                                    <p key={index} className="story-preview-content-text">{para}</p>
                                ))}
                                {storyResponse?.type === "full" && (
                                    <img src={storyResponse?.imageURL} alt="Story Image" className="story-preview-image" />
                                )}
                            </div>
                            {storyResponse?.type === "partial" && (<>
                                <h4 className="my-card-title my-4">Register for free to generate the full story!</h4>
                                <Link to="/register" className="call-to-register-button px-5 py-1">Register</Link>
                            </>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default GeneratePreview;