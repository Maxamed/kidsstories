import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const AdminUserView = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [message, setMessage] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchUserData = async () => {
        try {
            setMessage("Loading user data...");
            const response = await axios.get(`${API_BASE_URL}/admin/user/${id}`, { withCredentials: true });
            setUserData(response.data.user);
            setMessage("");
        } catch (error) {
            console.error(error);
            setMessage("An error occurred while fetching user data.");
        }
    };

    useEffect(() => {
        if (!user) {
            setMessage("Please log in to view the user data.");
        } else if (user.role !== "admin") {
            setMessage("You are not authorized to view this data.");
        } else {
            fetchUserData();
        }
    }, [user, id]);

    return (
        <Container fluid className="p-0 bg-container bg-2">
            <AdminSidebar />
            <Container className="text-center mt-5">
                <h1 className="text-blue-900 fw-900">USER DETAILS</h1>
                <Row className="justify-content-center mt-4">
                    {message ? (
                        <h4 className="alert alert-danger">{message}</h4>
                    ) : (
                        userData && (
                            <Col xs={12} md={8} lg={6}>
                                <Table striped bordered hover className="text-start">
                                    <tbody>
                                        <tr>
                                            <th>ID</th>
                                            <td>{userData.id}</td>
                                        </tr>
                                        <tr>
                                            <th>Name</th>
                                            <td>{userData.name}</td>
                                        </tr>
                                        <tr>
                                            <th>Email</th>
                                            <td>{userData.email}</td>
                                        </tr>
                                        <tr>
                                            <th>Role</th>
                                            <td>{userData.role}</td>
                                        </tr>
                                        <tr>
                                            <th>Account Type</th>
                                            <td>{userData.account_type}</td>
                                        </tr>
                                        <tr>
                                            <th>Timestamp</th>
                                            <td>{new Date(userData.timestamp).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <th>Story Count</th>
                                            <td>{userData.story_count}</td>
                                        </tr>
                                        <tr>
                                            <th>Feedback Count</th>
                                            <td>{userData.feedback_count}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Button variant="primary" onClick={() => navigate('/admin/user')} className="mb-4">
                                    Go Back
                                </Button>
                            </Col>
                        )
                    )}
                </Row>
            </Container>
        </Container>
    );
};

export default AdminUserView;