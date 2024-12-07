import React from "react";
import MyNavbar from "../components/MyNavbar";
import LogoText from "../components/LogoText";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const TermsAndConditions = () => {
    return (
        <Container fluid className="p-0 bg-container bg-4">
            <MyNavbar />
            <Container className="text-center mt-5">
                <h1 className="title-page">TERMS AND CONDITIONS</h1>
                <Row className="justify-content-center">
                    <Col xs={10} md={8} lg={8}>
                        <div className="card-container mt-4 mb-5 p-5 text-start">
                            Welcome to <LogoText />! These terms and conditions outline the rules and regulations for using the <LogoText /> website, accessible at [https://www.kidsstories.com](https://www.kidsstories.com). By accessing this website, you agree to these terms and conditions. If you do not agree, please discontinue use.
                            <br /><br />
                            <h5>Definitions</h5>
                            <ul>
                                <li><b>"Client," "You," "Your":</b> Refers to you, the user of this website, compliant with these terms.</li>
                                <li><b>"The Company," "We," "Us," "Our":</b> Refers to CALVO DEVESA, a Norway-based company (Organization Number: 819 466 882) with email contact at hello@fantasaur.com.</li>
                                <li><b>"Party," "Parties":</b> Refers to both the Client and Us.</li>
                            </ul>
                            These terms are governed by the laws of the Netherlands and pertain to the services provided by <LogoText />.
                            <br /><br />
                            <h5>Story Generation</h5>
                            <ul>
                                <li><b>Purpose:</b> <LogoText /> is a tool designed for parents to create bedtime stories for children. Adult supervision is mandatory.</li>
                                <li><b>Public Stories:</b> Stories generated are made publicly available via unique URLs. Avoid entering private information.</li>
                                <li><b>Deletion:</b> Generated stories and related content may be periodically deleted for server maintenance.</li>
                                <li><b>Prohibited Content:</b> Users must not input inappropriate content or anything damaging to our services or reputation.</li>
                                <li><b>Intellectual Property:</b> No intellectual property rights can be claimed on generated stories or associated assets.</li>
                            </ul>
                            <br />
                            <h5>Subscription Plans</h5>
                            <ul>
                                <li><b>Plan Changes:</b> Prices and features may change over time.</li>
                                <li><b>Cancellation:</b> Subscriptions can be canceled anytime, effective at the end of the billing period if done at least 48 hours prior.</li>
                            </ul>
                            <br />
                            <h5>Misuse</h5>
                            Users must not misuse the <LogoText /> platform by making invalid requests or breaching subscription limits. Misuse may result in service suspension.
                            <br /><br />
                            For further information, contact us at <b>hello@fantasaur.com</b>.
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default TermsAndConditions;