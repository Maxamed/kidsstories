import React, { useState } from "react";
import MyNavbar from "../components/MyNavbar";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const ContactUs = () => {
    const [contactData, setContactData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleContactDataChange = (e) => {
        const { name, value } = e.target;
        setContactData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleContactSubmit = () => {
        console.log(contactData);
    };

    return (
        <Container fluid className="p-0 bg-container bg-3" >
            <MyNavbar />
            <Container className="text-center mt-5">
                <h1 className="title-page">CONTACT US</h1>
                <Row className="justify-content-center">
                    <Col xs={10} md={6} lg={6}>
                        <div className="my-card p-5 my-4">
                            <h4 className="my-card-title">Let's talk, contact us anytime</h4>
                            <Form className="mt-4 mx-lg-5">
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
                                <div className="green-button my-3 py-1" onClick={handleContactSubmit}>Submit</div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container >
    )
}

export default ContactUs