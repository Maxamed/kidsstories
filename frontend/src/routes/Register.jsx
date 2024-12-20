import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";

import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google"

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Register = () => {
    const { user, register, googleRegister, setAuthError, error, isLoading } = useAuth();
    const [isRegistered, setIsRegistered] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (user) {
            setAuthError("An account is already logged in! Redirecting...");
            setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 1000);
            return;
        }
        setIsRegistered(false);
        await register(formData.name, formData.email, formData.password, formData.confirmPassword);
        setIsRegistered(true);
    };

    const handleGoogleRegister = async (tokenResponse) => {
        if (user) {
            setAuthError("An account is already logged in! Redirecting...");
            setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 1000);
            return;
        }
        setIsRegistered(false);
        await googleRegister(tokenResponse.access_token);
        setIsRegistered(true);
    };

    const handleGoogleToken = useGoogleLogin({
        onSuccess: tokenResponse => handleGoogleRegister(tokenResponse),
        onError: error => setAuthError(error),
    });

    useEffect(() => {
        if (isRegistered && !error) {
            setSuccessMessage("Account registered successfully! Redirecting...");
            setTimeout(() => {
                navigate("/login");
                window.location.reload();
            }, 1000);
        }
    }, [isRegistered, error]);

    return (
        <Container fluid className="p-0 bg-container bg-1">
            <MyNavbar />
            <Container className="text-center mt-5 pb-5">
                <h1 className="text-blue-900 fw-900">REGISTER</h1>
                <Row className="justify-content-center mt-4">
                    <Col xs={11} md={8} lg={4}>
                        <div className="my-card p-4">
                            <Form onSubmit={handleRegister}>
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="alert alert-success" role="alert">
                                        {successMessage}
                                    </div>
                                )}
                                <Form.Group controlId="formName">
                                    <Form.Control
                                        type="text"
                                        placeholder="Name"
                                        className="my-card-input my-3 py-2 px-4"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        className="my-card-input my-3 py-2 px-4"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        className="my-card-input my-3 py-2 px-4"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formConfirmPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="my-card-input my-3 py-2 px-4"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Button
                                    type="submit"
                                    className="green-button w-100 py-2 mb-2"
                                    tabIndex={0}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Registering..." : "Register"}
                                </Button>
                                <div className="my-3 font-weight-600">Or</div>
                                <Button
                                    variant="outline-secondary"
                                    className="w-100 py-2 d-flex align-items-center justify-content-center oauth-button mb-2"
                                    tabIndex={0}
                                    onClick={() => handleGoogleToken()}
                                >
                                    <img
                                        src="https://img.icons8.com/color/48/000000/google-logo.png"
                                        alt="google"
                                        className="oauth-icon"
                                    />
                                    Continue with Google
                                </Button>
                            </Form>
                            <div className="mt-4 mb-1 font-weight-600">
                                Already have an account?{" "}
                                <Link
                                    className="green-text text-decoration-none"
                                    to="/login"
                                >
                                    Login!
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default Register;
