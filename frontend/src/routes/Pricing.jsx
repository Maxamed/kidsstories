import React from "react";
import MyNavbar from "../components/MyNavbar";
import PricingItem from "../components/PricingItem";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Pricing = () => {
    return (
        <Container fluid className="p-0 bg-container bg-5">
            <MyNavbar />
            <Container className="text-center mt-5">
                <h1 className="title-page mb-5">Pricing</h1>
                <Row className="justify-content-center">
                    <Col xs={10} md={6} lg={3}>
                        <div className="bg-white rounded-4 my-shadow-inset my-3 p-4 d-flex flex-column align-items-center">
                            <h4 className="my-card-title my-3">Free</h4>
                            <h6 className="my-color">Free Trial</h6>
                            <h6 className="mb-4">No credit card required</h6>
                            <div className="text-start mx-2">
                                <PricingItem text="Create 10 free stories" />
                                <PricingItem text="Stories deleted after 30 days" />
                                <PricingItem text="Contains ads" />
                                <PricingItem text="1 truly unique image per story" />
                                <PricingItem text="8 morals of story to choose" />
                                <PricingItem text="Share stories with unique link" />
                                <PricingItem text="A robust text and image AI generation model" />
                            </div>
                            <div className="green-button my-3 py-1 px-4">Start Free Trial</div>
                        </div>
                    </Col>
                    <Col xs={10} md={6} lg={3}>
                        <div className="bg-white rounded-4 my-shadow-inset my-3 p-4 d-flex flex-column align-items-center">
                            <h4 className="my-card-title my-3">Free</h4>
                            <h6 className="my-color">Free Trial</h6>
                            <h6 className="mb-4">No credit card required</h6>
                            <div className="text-start mx-2">
                                <PricingItem text="Create 10 free stories" />
                                <PricingItem text="Stories deleted after 30 days" />
                                <PricingItem text="Contains ads" />
                                <PricingItem text="1 truly unique image per story" />
                                <PricingItem text="8 morals of story to choose" />
                                <PricingItem text="Share stories with unique link" />
                                <PricingItem text="A robust text and image AI generation model" />
                            </div>
                            <div className="green-button my-3 py-1 px-4">Start Free Trial</div>
                        </div>
                    </Col>
                    <Col xs={10} md={6} lg={3}>
                        <div className="bg-white rounded-4 my-shadow-inset my-3 p-4 d-flex flex-column align-items-center">
                            <h4 className="my-card-title my-3">Free</h4>
                            <h6 className="my-color">Free Trial</h6>
                            <h6 className="mb-4">No credit card required</h6>
                            <div className="text-start mx-2">
                                <PricingItem text="Create 10 free stories" />
                                <PricingItem text="Stories deleted after 30 days" />
                                <PricingItem text="Contains ads" />
                                <PricingItem text="1 truly unique image per story" />
                                <PricingItem text="8 morals of story to choose" />
                                <PricingItem text="Share stories with unique link" />
                                <PricingItem text="A robust text and image AI generation model" />
                            </div>
                            <div className="green-button my-3 py-1 px-4">Start Free Trial</div>
                        </div>
                    </Col>
                    <Col xs={10} md={6} lg={3}>
                        <div className="bg-white rounded-4 my-shadow-inset my-3 p-4 d-flex flex-column align-items-center">
                            <h4 className="my-card-title my-3">Free</h4>
                            <h6 className="my-color">Free Trial</h6>
                            <h6 className="mb-4">No credit card required</h6>
                            <div className="text-start mx-2">
                                <PricingItem text="Create 10 free stories" />
                                <PricingItem text="Stories deleted after 30 days" />
                                <PricingItem text="Contains ads" />
                                <PricingItem text="1 truly unique image per story" />
                                <PricingItem text="8 morals of story to choose" />
                                <PricingItem text="Share stories with unique link" />
                                <PricingItem text="A robust text and image AI generation model" />
                            </div>
                            <div className="green-button my-3 py-1 px-4">Start Free Trial</div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default Pricing