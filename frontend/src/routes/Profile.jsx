import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MyNavbar from "../components/MyNavbar";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import axios from 'axios';

const Profile = () => {
    const { user, fetchUser } = useAuth();
    const [userData, setUserData] = useState({
        name: "",
        email: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const updateName = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            if (!userData.name) {
                setError("Name cannot be empty.");
                return;
            }
            setMessage("Updating name...");
            const response = await axios.put(`${API_BASE_URL}/user/update-name`, {
                name: userData.name
            }, { withCredentials: true });
            setMessage(response.data.message);
            fetchUser();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            setMessage("");
            console.error(error);
            setError(error.response?.data?.message || "An error occurred while updating name.");
            setUserData({ ...userData, name: user.name, email: user.email });
        }
    };

    const updateEmail = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            if (!userData.email) {
                setError("Email cannot be empty.");
                return;
            }
            setMessage("Updating email...");
            const response = await axios.put(`${API_BASE_URL}/user/update-email`, {
                email: userData.email
            }, { withCredentials: true });
            setMessage(response.data.message);
            fetchUser();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            setMessage("");
            console.error(error);
            setError(error.response?.data?.message || "An error occurred while updating email.");
            setUserData({ ...userData, name: user.name, email: user.email });
        }
    };

    useEffect(() => {
        if (!user) {
            setMessage("Please log in to view your profile.");
        } else {
            setUserData({
                name: user.name,
                email: user.email
            });
        }
    }, [user]);

    useEffect(() => {
        setError("");
        setMessage("");
    }, []);

    return (
        <Container fluid className="p-0 bg-container bg-1">
            <MyNavbar />
            <Container className="text-center mt-5 pb-5">
                <h1 className="text-blue-900 fw-900">PROFILE</h1>
                <Row className="justify-content-center mt-4">
                    <Col xs={11} md={8} lg={4}>
                        <div className="my-card p-4">
                            <Form>
                                {message && <h6 className="alert alert-info">{message}</h6>}
                                {error && <h6 className="alert alert-danger">{error}</h6>}
                                <Form.Group className="mb-3 text-start" controlId="name">
                                    <Form.Label className="fw-bold">Name:</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type="text"
                                            value={userData.name}
                                            className="my-card-input mb-3 py-2 px-4"
                                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        />
                                        <div onClick={updateName} className="edit-profile py-2 px-3">
                                            <i className="fa-solid fa-floppy-disk" />
                                        </div>
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3 text-start" controlId="email">
                                    <Form.Label className="fw-bold">Email:</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type="email"
                                            value={userData.email}
                                            className="my-card-input mb-3 py-2 px-4"
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        />
                                        <div className="edit-profile py-2 px-3" onClick={updateEmail}>
                                            <i className="fa-solid fa-floppy-disk" />
                                        </div>
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3 text-start" controlId="accountType">
                                    <Form.Label className="fw-bold">Account Type:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user?.account_type}
                                        className="my-card-input py-2 px-4"
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 text-start" controlId="accountType">
                                    <Form.Label className="fw-bold">Creation Date:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={new Date(user?.timestamp).toLocaleString()}
                                        className="my-card-input py-2 px-4"
                                        disabled
                                    />
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container >
    )
}

export default Profile