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

const AdminFeedbackView = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [feedbackData, setFeedbackData] = useState(null);
    const [message, setMessage] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchFeedbackData = async () => {
        try {
            setMessage("Loading feedback data...");
            const response = await axios.get(`${API_BASE_URL}/admin/feedback/${id}`, { withCredentials: true });
            setFeedbackData(response.data.feedback);
            setMessage("");
        } catch (error) {
            console.error(error);
            setMessage("An error occurred while fetching feedback data.");
        }
    };

    useEffect(() => {
        if (!user) {
            setMessage("Please log in to view the feedback data.");
        } else if (user.role !== "admin") {
            setMessage("You are not authorized to view this data.");
        } else {
            fetchFeedbackData();
        }
    }, [user, id]);

    return (
        <Container fluid className="p-0 bg-container bg-2">
            <AdminSidebar />
            <Container className="text-center mt-5">
                <h1 className="text-blue-900 fw-900">FEEDBACK DETAILS</h1>
                <Row className="justify-content-center mt-4">
                    {message ? (
                        <h4 className="alert alert-danger">{message}</h4>
                    ) : (
                        feedbackData && (
                            <Col xs={12} md={8} lg={6}>
                                <Table striped bordered hover className="text-start">
                                    <tbody>
                                        <tr>
                                            <th>ID</th>
                                            <td>{feedbackData.id}</td>
                                        </tr>
                                        <tr>
                                            <th>On Story ID</th>
                                            <td>{feedbackData.story_id}</td>
                                        </tr>
                                        <tr>
                                            <th>By User ID</th>
                                            <td>{feedbackData.user_id}</td>
                                        </tr>
                                        <tr>
                                            <th>Rating</th>
                                            <td>{feedbackData.rating}</td>
                                        </tr>
                                        <tr>
                                            <th>Comment</th>
                                            <td>{feedbackData.comment}</td>
                                        </tr>
                                        <tr>
                                            <th>Timestamp</th>
                                            <td>{new Date(feedbackData.timestamp).toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Button variant="primary" onClick={() => navigate('/admin/feedback')} className="mb-4">
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

export default AdminFeedbackView;