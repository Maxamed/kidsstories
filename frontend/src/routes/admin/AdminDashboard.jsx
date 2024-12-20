import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import AdminSidebar from '../../components/AdminSidebar'

import { useAuth } from "../../context/AuthContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import axios from "axios";

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [dashboardData, setDashboardData] = useState({});
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchDashboardData = async () => {
        try {
            setMessage("Loading dashboard data...");
            const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, { withCredentials: true });
            const data = response.data;
            setDashboardData(data);
            setMessage("");
        } catch (error) {
            console.error(error);
            setMessage("An error occurred while fetching dashboard data.");
        }
    };

    useEffect(() => {
        if (!user) {
            setMessage("Please log in to view the dashboard.");
        } else if (user.role !== "admin") {
            setMessage("You are not authorized to view the dashboard.");
        } else {
            fetchDashboardData();
        }
    }, [user]);

    return (
        <Container fluid className="p-0 bg-container bg-2">
            <AdminSidebar />
            <Container className="text-center mt-5">
                <h1 className="text-blue-900 fw-900">DASHBOARD</h1>
                <Row className="justify-content-center mt-4">
                    {message ? (
                        <h4 className="alert alert-danger">{message}</h4>
                    ) : (
                        <>
                            <Col xs={10} md={6} lg={3} className="my-2">
                                <div className="d-flex justify-content-around align-items-center bg-light p-3 rounded-3 h-100" onClick={() => navigate("/admin/user")}>
                                    <i className="fa-solid fa-user fa-4x" style={{ color: "rgba(224, 54, 54, 0.8)" }} />
                                    <div className="d-flex flex-column justify-content-center">
                                        <h3 className="text-blue-900 fw-700">Users</h3>
                                        <h1 className="text-blue-900 fw-900">{dashboardData.user_count}</h1>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={10} md={6} lg={3} className="my-2">
                                <div className="d-flex justify-content-around align-items-center bg-light p-3 rounded-3 h-100" onClick={() => navigate("/admin/story")}>
                                    <i className="fa-solid fa-book fa-4x" style={{ color: "rgba(0, 123, 224, 0.8)" }} />
                                    <div className="d-flex flex-column justify-content-center">
                                        <h3 className="text-blue-900 fw-700">Stories</h3>
                                        <h1 className="text-blue-900 fw-900">{dashboardData.story_count}</h1>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={10} md={6} lg={3} className="my-2">
                                <div className="d-flex justify-content-around align-items-center bg-light p-3 rounded-3 h-100" onClick={() => navigate("/admin/feedback")}>
                                    <i className="fa-solid fa-comment fa-4x" style={{ color: "rgba(247, 153, 0, 0.8)" }} />
                                    <div className="d-flex flex-column justify-content-center">
                                        <h3 className="text-blue-900 fw-700">Feedbacks</h3>
                                        <h1 className="text-blue-900 fw-900">{dashboardData.feedback_count}</h1>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={10} md={6} lg={3} className="my-2">
                                <div className="d-flex justify-content-around align-items-center bg-light p-3 rounded-3 h-100" onClick={() => navigate("/admin/contact")}>
                                    <i className="fa-solid fa-phone fa-4x" style={{ color: "rgba(20, 191, 150, 0.8)" }} />
                                    <div className="d-flex flex-column justify-content-center">
                                        <h3 className="text-blue-900 fw-700">Contact Queries</h3>
                                        <h1 className="text-blue-900 fw-900">{dashboardData.contact_count}</h1>
                                    </div>
                                </div>
                            </Col>
                        </>
                    )}
                </Row>
            </Container>
        </Container>
    )
}

export default AdminDashboard