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

const AdminContactView = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [contactData, setContactData] = useState(null);
    const [message, setMessage] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchContactData = async () => {
        try {
            setMessage("Loading contact data...");
            const response = await axios.get(`${API_BASE_URL}/admin/contact/${id}`, { withCredentials: true });
            setContactData(response.data.contact);
            setMessage("");
        } catch (error) {
            console.error(error);
            setMessage("An error occurred while fetching contact data.");
        }
    };

    useEffect(() => {
        if (!user) {
            setMessage("Please log in to view the contact data.");
        } else if (user.role !== "admin") {
            setMessage("You are not authorized to view this data.");
        } else {
            fetchContactData();
        }
    }, [user, id]);

    return (
        <Container fluid className="p-0 bg-container bg-2">
            <AdminSidebar />
            <Container className="text-center mt-5">
                <h1 className="text-blue-900 fw-900">CONTACT DETAILS</h1>
                <Row className="justify-content-center mt-4">
                    {message ? (
                        <h4 className="alert alert-danger">{message}</h4>
                    ) : (
                        contactData && (
                            <Col xs={12} md={8} lg={6}>
                                <Table striped bordered hover className="text-start">
                                    <tbody>
                                        <tr>
                                            <th>ID</th>
                                            <td>{contactData.id}</td>
                                        </tr>
                                        <tr>
                                            <th>Name</th>
                                            <td>{contactData.name}</td>
                                        </tr>
                                        <tr>
                                            <th>Email</th>
                                            <td>{contactData.email}</td>
                                        </tr>
                                        <tr>
                                            <th>Message</th>
                                            <td>{contactData.message}</td>
                                        </tr>
                                        <tr>
                                            <th>Timestamp</th>
                                            <td>{new Date(contactData.timestamp).toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Button variant="primary" onClick={() => navigate('/admin/contact')} className="mb-4">
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

export default AdminContactView;