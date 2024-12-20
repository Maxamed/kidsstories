import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from "../../context/AuthContext";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import axios from "axios";

const AdminStoryView = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [storyData, setStoryData] = useState(null);
    const [message, setMessage] = useState("");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL;

    const fetchStoryData = async () => {
        try {
            setMessage("Loading story data...");
            const response = await axios.get(`${API_BASE_URL}/admin/story/${id}`, { withCredentials: true });
            const storyDataTemp = response.data.story;
            const paragraphs = storyDataTemp.content.split("\n");
            const imageURL = `${ASSETS_BASE_URL}/images/${storyDataTemp.id}.png`;
            setStoryData({ ...storyDataTemp, paragraphs, imageURL });
            setMessage("");
        } catch (error) {
            console.error(error);
            setMessage("An error occurred while fetching story data.");
        }
    };

    useEffect(() => {
        console.log(storyData);
    }, [storyData]);

    useEffect(() => {
        if (!user) {
            setMessage("Please log in to view the story data.");
        } else if (user.role !== "admin") {
            setMessage("You are not authorized to view this data.");
        } else {
            fetchStoryData();
        }
    }, [user, id]);

    return (
        <Container fluid className="p-0 bg-container bg-2">
            <AdminSidebar />
            <Container className="text-center mt-5">
                <h1 className="text-blue-900 fw-900">STORY DETAILS</h1>
                <Row className="justify-content-center mt-4">
                    <Col xs={12} md={8} lg={8}>
                        {message ? (
                            <h4 className="alert alert-danger">{message}</h4>
                        ) : (
                            storyData && (
                                <>
                                    <Table striped bordered hover className="text-start">
                                        <tbody>
                                            <tr>
                                                <th>ID</th>
                                                <td>{storyData.id}</td>
                                            </tr>
                                            <tr>
                                                <th>Title</th>
                                                <td>{storyData.title}</td>
                                            </tr>
                                            <tr>
                                                <th>Created By User</th>
                                                <td>{storyData.user_id}</td>
                                            </tr>
                                            <tr>
                                                <th>Is Shared Publically?</th>
                                                <td>{storyData.isPublished ? "Yes" : "No"}</td>
                                            </tr>
                                            <tr>
                                                <th>Timestamp</th>
                                                <td>{new Date(storyData.timestamp).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <th>Feedback Count</th>
                                                <td>{storyData.feedback_count}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate('/admin/story')}
                                        className="mb-4"
                                    >
                                        Go Back
                                    </Button>
                                    <div className="story-preview-content mb-4 p-4">
                                        <h4 id="story-title" className="my-card-title my-3">{storyData?.title}</h4>
                                        {storyData?.paragraphs.map((para, index) => (
                                            <React.Fragment key={index}>
                                                {index === Math.floor(storyData.paragraphs.length / 3) && (
                                                    <img
                                                        src={storyData?.imageURL}
                                                        alt="Story Image"
                                                        className="float-lg-end story-preview-image my-2 ms-lg-5"
                                                    />
                                                )}
                                                <p
                                                    className="story-preview-content-text"
                                                    key={index}
                                                >{para}</p>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </>
                            )
                        )}
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default AdminStoryView
