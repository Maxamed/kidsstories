import React, { useEffect, useState } from "react";
import MyNavbar from "../components/MyNavbar";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useStoryGenerate } from "../context/StoryGenerateContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';

const Home = () => {
    const { user } = useAuth();
    const { isGenerating, error, storyGenerateData, handleStoryGenerateDataChange, generateStory, storyResponse } = useStoryGenerate();
    const [isGenerated, setIsGenerated] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsGenerated(false);
        await generateStory(user);
        setIsGenerated(true);
        setMessage(null);
    };

    useEffect(() => {
        const initialData = {
            story_length: "short",
            story_genre: "",
            story_moral: "",
            story_moral_custom: "",
            child_age: "",
            child_name: "",
        };

        Object.entries(initialData).forEach(([name, value]) => {
            handleStoryGenerateDataChange({
                target: { name, value },
            });
        });

        const storyGenData = localStorage.getItem("storyGenerateData");
        const registered = localStorage.getItem("registered");
        if (storyGenData && registered) {
            localStorage.removeItem("storyGenerateData");
            localStorage.removeItem("registered");
            const data = JSON.parse(storyGenData);
            Object.entries(data).forEach(([name, value]) => {
                handleStoryGenerateDataChange({
                    target: { name, value },
                });
            });
            const submitButton = document.querySelector("button[type='submit']");
            submitButton.click();
            setMessage("Your trial story is being converted to a full story. Please wait...");
        }
    }, []);

    useEffect(() => {
        if (isGenerated && !isGenerating && !error && storyResponse) {
            if (storyResponse.type === "full") {
                navigate("/story/" + storyResponse.storyID);
            } else {
                navigate("/generate-preview");
            }
        }
    }, [isGenerated, isGenerating, error, storyResponse]);

    return (
        <Container fluid className="p-0 bg-container bg-2">
            <MyNavbar />
            <Container className="text-center mt-5">
                <h1 className="text-blue-900 fw-900">GENERATE STORY</h1>
                <Row className="justify-content-center">
                    <Col xs={11} md={8} lg={4}>
                        <div className="my-card p-5 mt-4">
                            <h4 className="my-card-title">Tell us about your child</h4>
                            <Form className="mt-4" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                {message && (
                                    <div className="alert alert-info" role="alert">
                                        {message}
                                    </div>
                                )}
                                <Form.Group controlId="formChildName">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your child's name"
                                        name="child_name"
                                        value={storyGenerateData.child_name}
                                        onChange={handleStoryGenerateDataChange}
                                        className="my-card-input my-3 py-2 px-4"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formChildAge">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your child's age"
                                        name="child_age"
                                        value={storyGenerateData.child_age}
                                        onChange={handleStoryGenerateDataChange}
                                        className="my-card-input my-3 py-2 px-4"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formMoralStory">
                                    <Form.Control
                                        as="select"
                                        name="story_moral"
                                        value={storyGenerateData.story_moral}
                                        onChange={handleStoryGenerateDataChange}
                                        className="my-card-input my-3 py-2 px-4"
                                    >
                                        <option value="">Select the moral of the story</option>
                                        <option value="Courage & Bravery">Courage & Bravery</option>
                                        <option value="Teamwork & Cooperation">Teamwork & Cooperation</option>
                                        <option value="Honesty & Integrity">Honesty & Integrity</option>
                                        <option value="Gratitude & Humility">Gratitude & Humility</option>
                                        <option value="Perseverance & Determination">Perseverance & Determination</option>
                                        <option value="Respect for Nature">Respect for Nature</option>
                                        <option value="Sharing & Generosity">Sharing & Generosity</option>
                                        <option value="Creativity & Curiosity">Creativity & Curiosity</option>
                                        <option value="Responsibility & Accountability">Responsibility & Accountability</option>
                                        <option value="custom">Custom Moral</option>
                                    </Form.Control>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the moral of the story"
                                        name="story_moral_custom"
                                        value={storyGenerateData.story_moral_custom}
                                        onChange={handleStoryGenerateDataChange}
                                        className="my-card-input my-3 py-2 px-4"
                                        style={{ display: storyGenerateData.story_moral === "custom" ? "block" : "none" }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formGenreStory">
                                    <Form.Control
                                        as="select"
                                        name="story_genre"
                                        value={storyGenerateData.story_genre}
                                        onChange={handleStoryGenerateDataChange}
                                        className="my-card-input my-3 py-2 px-4"
                                    >
                                        <option value="">Select the genre of the story</option>
                                        <option value="Fantasy">Fantasy</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Mystery">Mystery</option>
                                        <option value="Science Fiction">Science Fiction</option>
                                        <option value="Fables & Morals">Fables & Morals</option>
                                        <option value="Humor">Humor</option>
                                        <option value="Fairy Tales">Fairy Tales</option>
                                        <option value="Educational">Educational</option>
                                        <option value="Holiday & Seasonal">Holiday & Seasonal</option>
                                        <option value="Friendship & Family">Friendship & Family</option>
                                        <option value="custom">Custom Genre</option>
                                    </Form.Control>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the genre of the story"
                                        name="story_genre_custom"
                                        value={storyGenerateData.story_genre_custom}
                                        onChange={handleStoryGenerateDataChange}
                                        className="my-card-input my-3 py-2 px-4"
                                        style={{ display: storyGenerateData.story_genre === "custom" ? "block" : "none" }}
                                    />
                                </Form.Group>
                                {user && (
                                    <Form.Group controlId="formStoryLength">
                                        <Form.Control
                                            as="select"
                                            name="story_length"
                                            value={storyGenerateData.story_length}
                                            onChange={handleStoryGenerateDataChange}
                                            className="my-card-input my-3 py-2 px-4"
                                        >
                                            <option value="short">Short Story</option>
                                            <option value="medium">Medium Story</option>
                                            <option value="long">Long Story</option>
                                        </Form.Control>
                                    </Form.Group>
                                )}
                                <Button className="green-button w-100 py-2 mt-2 d-flex justify-content-center align-items-center" type="submit">
                                    {isGenerating
                                        ? <>
                                            <div className="d-inline-block">Generating</div>
                                            <div className="d-inline-block">&nbsp;</div>
                                            <Spinner animation="border" role="status" className="">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        </>
                                        : <div className="d-inline-block">Generate Story</div>
                                    }
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default Home;
