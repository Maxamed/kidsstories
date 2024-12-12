import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";

import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google"

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Login = () => {
    const { user, login, googleLogin, setAuthError, error, isLoading } = useAuth();
    const [isLogged, setIsLogged] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (user) {
            setAuthError("An account is already logged in! Redirecting...");
            setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 5000);
            return;
        }
        setIsLogged(false);
        await login(formData.email, formData.password);
        setIsLogged(true);
    };

    const handleGoogleLogin = async (tokenResponse) => {
        if (user) {
            setAuthError("An account is already logged in! Redirecting...");
            setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 5000);
            return;
        }
        setIsLogged(false);
        await googleLogin(tokenResponse.access_token);
        setIsLogged(true);
    };

    const handleGoogleToken = useGoogleLogin({
        onSuccess: tokenResponse => handleGoogleLogin(tokenResponse),
        onError: error => setAuthError(error),
    });


    useEffect(() => {
        if (isLogged && !error) {
            setSuccessMessage("Logged in successfully! Redirecting...");
            setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 5000);
        }
    }, [isLogged, error]);

    return (
        <Container fluid className="p-0 bg-container bg-1">
            <MyNavbar />
            <Container className="text-center mt-5 pb-5">
                <h1 className="title-page">LOGIN</h1>
                <Row className="justify-content-center mt-4">
                    <Col xs={11} md={8} lg={4}>
                        <div className="my-card p-4">
                            <Form onSubmit={handleLogin}>
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
                                <div
                                    className="text-start mb-3 font-weight-600"
                                    tabIndex={0}
                                >
                                    Forgot Password?
                                </div>
                                <Button
                                    type="submit"
                                    className="green-button w-100 py-2 mb-2"
                                    tabIndex={0}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Logging in..." : "Login"}
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
                                    Login with Google
                                </Button>
                            </Form>
                            <div className="mt-4 mb-1 font-weight-600">
                                Don't have an account?{" "}
                                <Link
                                    className="green-text text-decoration-none"
                                    to="/register"
                                >
                                    Register!
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container >
        </Container >
    );
};

export default Login;
