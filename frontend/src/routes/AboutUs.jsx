import React from "react";
import MyNavbar from "../components/MyNavbar";
import LogoText from "../components/LogoText";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const AboutUs = () => {
    return (
        <Container fluid className="p-0 bg-container bg-2">
            <MyNavbar />
            <Container className="text-center mt-5">
                <h1 className="title-page">ABOUT US</h1>
                <Row className="justify-content-center">
                    <Col xs={10} md={8} lg={8}>
                        <div className="card-container mt-4 mb-5 p-5 text-start">
                            <LogoText /> is an innovative app designed to ignite children's imaginations through personalized and emotive storytelling. By crafting unique stories tailored to each child's preferences and interests, it transforms every child into an enthusiastic reader, one story at a time.
                            <br /><br />
                            Leveraging advanced technology, the platform prioritizes inclusivity, catering to children with diverse needs, including those with neurodivergence. Customizable features ensure the stories adapt to various learning styles and accessibility requirements, making the app suitable for all children.
                            <br /><br />
                            Each story is thoughtfully designed to be educational, helping children develop reading skills while fostering a lifelong love for books. Imbued with positive values, these stories inspire and empower young readers with meaningful and engaging narratives.
                            <br /><br />
                            <LogoText /> is exceptionally user-friendly, enabling parents and educators to create personalized stories effortlessly with just a few clicks. With this pioneering app, every child can experience the magic of their own unique story, making reading and learning an enjoyable and enriching adventure.
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default AboutUs