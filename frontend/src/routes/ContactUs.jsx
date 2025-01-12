import React, { useState, useEffect } from "react";
import MyNavbar from "../components/MyNavbar";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import axios from "axios";

const ContactUs = () => {
    const [contactData, setContactData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleContactDataChange = (e) => {
        const { name, value } = e.target;
        setContactData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setResponseMessage("");
        setErrorMessage("");
        try {
            const response = await axios.post(`${API_BASE_URL}/contact/submit`, contactData, { withCredentials: true });
            setResponseMessage(response.data.message);
            setContactData({
                name: "",
                email: "",
                message: "",
            });
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
        setIsSubmitting(false);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setResponseMessage("");
            setErrorMessage("");
        }, 3000);
        return () => clearTimeout(timeout);
    }, [responseMessage, errorMessage]);

    return (
        <Container fluid className="p-0 bg-container bg-3" >
            <MyNavbar />
            <Container className="text-center mt-5">
                <h1 className="text-blue-900 fw-900">CONTACT US</h1>
                <Row className="justify-content-center">
                    <Col xs={10} md={6} lg={6}>
                        <div className="my-card p-5 my-4">
                            <h4 className="my-card-title">Let's talk, contact us anytime</h4>
                            <Form className="mt-4 mx-lg-5" onSubmit={handleContactSubmit}>
                                {responseMessage && <p className="alert alert-success">{responseMessage}</p>}
                                {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
                                <Form.Group controlId="formName">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        name="name"
                                        value={contactData.name}
                                        onChange={handleContactDataChange}
                                        className="rounded-pill my-3 py-2 px-4"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail">
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        name="email"
                                        value={contactData.email}
                                        onChange={handleContactDataChange}
                                        className="rounded-pill my-3 py-2 px-4"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formMessage">
                                    <Form.Control
                                        as="textarea"
                                        rows={10}
                                        placeholder="Enter your message"
                                        name="message"
                                        value={contactData.message}
                                        onChange={handleContactDataChange}
                                        className="rounded-3 my-3 py-2 px-4"
                                    />
                                </Form.Group>
                                <Button
                                    type="submit"
                                    className="green-button my-3 py-1 w-100"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container >
    )
}

export default ContactUs