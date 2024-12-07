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
    const { user, csrfToken } = useAuth();
    const { isGenerating, error, storyGenerateData, handleStoryGenerateDataChange, generateStory } = useStoryGenerate();
    const [isGenerated, setIsGenerated] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsGenerated(false);
        await generateStory(user, csrfToken);
        setIsGenerated(true);
    };

    useEffect(() => {
        if (isGenerated && !isGenerating && !error) {
            navigate("/generate-preview");
        }
    }, [isGenerated, isGenerating, error]);

    return (
        <Container fluid className="p-0 bg-container bg-2">
            <MyNavbar />
            <Container className="text-center mt-5">
                <h1 className="title-page">GENERATE STORY</h1>
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
                                <Form.Group controlId="formChildName">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your child's name"
                                        name="child_name"
                                        value={storyGenerateData.childName}
                                        onChange={handleStoryGenerateDataChange}
                                        className="my-card-input my-3 py-2 px-4"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formChildAge">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your child's age"
                                        name="child_age"
                                        value={storyGenerateData.childAge}
                                        onChange={handleStoryGenerateDataChange}
                                        className="my-card-input my-3 py-2 px-4"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formMoralStory">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the moral of the story"
                                        name="story_moral"
                                        value={storyGenerateData.storyMoral}
                                        onChange={handleStoryGenerateDataChange}
                                        className="my-card-input my-3 py-2 px-4"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formGenreStory">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the genre of the story"
                                        name="story_genre"
                                        value={storyGenerateData.storyGenre}
                                        onChange={handleStoryGenerateDataChange}
                                        className="my-card-input my-3 py-2 px-4"
                                    />
                                </Form.Group>
                                {user && (
                                    <Form.Group controlId="formStoryLength">
                                        <Form.Control
                                            as="select"
                                            name="story_length"
                                            value={storyGenerateData.storyLength}
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
