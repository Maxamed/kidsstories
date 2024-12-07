import React from "react";
import MyNavbar from "../components/MyNavbar";
import LogoText from "../components/LogoText";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const PrivacyPolicy = () => {
    return (
        <Container fluid className="p-0 bg-container bg-4">
            <MyNavbar />
            <Container className="text-center mt-5">
                <h1 className="title-page">PRIVACY POLICY</h1>
                <Row className="justify-content-center">
                    <Col xs={10} md={8} lg={8}>
                        <div className="card-container mt-4 mb-5 p-5 text-start">
                            At <LogoText />, accessible via [https://www.kidsstories.com](https://www.kidsstories.com) and [https://blog.kidsstories.com](https://blog.kidsstories.com), protecting the privacy of our visitors is a top priority. This Privacy Policy outlines the types of information collected and recorded by <LogoText /> and explains how we use it.
                            <br /><br />
                            If you have any questions or need additional information regarding this Privacy Policy, feel free to contact us at <b>hello@fantasaur.com</b>.
                            <br /><br />
                            <h5>Scope of the Privacy Policy</h5>
                            This Privacy Policy applies only to information collected through our online platforms. It is valid for visitors to our website concerning the information they share and/or we collect.
                            <br /><br />
                            <h5>Consent</h5>
                            By using our website, you consent to this Privacy Policy and agree to its terms.
                            <br /><br />
                            <h5>Information We Collect</h5>
                            The personal information we request and the reasons for collecting it will be made clear at the time we ask for it. Some examples include:
                            <ul>
                                <li><b>Direct Communication:</b> If you contact us directly, we may collect your name, email address, phone number, the contents of your message, and any other details you choose to provide.</li>
                                <li><b>Account Registration:</b> When registering for an account, we may ask for contact information, such as your name and email address.</li>
                                <li><b>Subscription Information:</b> Our payment partner, <b>Stripe</b>, generates a unique customer ID for each user. <LogoText /> stores this ID, but payment details are managed entirely by Stripe. We recommend reviewing their privacy policy.</li>
                                <li><b>Story Preferences:</b> To create personalized stories, we store your story preferences, including language, custom names for characters, and moral or thematic elements.</li>
                                <li><b>Created Stories:</b> Stories created on <LogoText /> are publicly available and should not contain private information.</li>
                            </ul>
                            <h5>Account Deletion</h5>
                            You can delete your account via the "Account" menu. Deleting your account will:
                            <ul>
                                <li>Cancel all active subscriptions</li>
                                <li>Erase all personal information, including created stories</li>
                                <li>Retain only a reference to your email address to prevent misuse of free trials</li>
                            </ul>
                            <h5>How We Use Your Information</h5>
                            The information we collect is used for various purposes, including:
                            <ul>
                                <li>Operating, providing, and maintaining our website</li>
                                <li>Improving and personalizing user experience</li>
                                <li>Understanding and analyzing website usage</li>
                                <li>Developing new features, services, and functionality</li>
                                <li>Communicating with you for customer service, updates, and promotional purposes</li>
                                <li>Sending important notifications and emails</li>
                                <li>Preventing fraud</li>
                            </ul>
                            <h5>Third-Party Payment Processing</h5>
                            We rely on <b>Stripe</b> for secure payment processing. <LogoText /> does not access or store your payment details. For more details, consult Stripe's Privacy Policy.
                            <br /><br />
                            For further assistance or questions about this Privacy Policy, please reach out to us at <b>hello@fantasaur.com</b>.
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default PrivacyPolicy;