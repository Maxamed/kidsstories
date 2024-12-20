import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const AdminFeedback = () => {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [message, setMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteModalMessage, setDeleteModalMessage] = useState("");
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
    const [filterByUser, setFilterByUser] = useState(false);
    const [filterUserId, setFilterUserId] = useState("");
    const [filterByStory, setFilterByStory] = useState(false);
    const [filterStoryId, setFilterStoryId] = useState("");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchFeedbacks = async (page, perPage, userId = "", storyId = "") => {
        try {
            setMessage("Loading feedbacks...");
            const filterQuery1 = userId ? `&by_user=${userId}` : "";
            const filterQuery2 = storyId ? `&by_story=${storyId}` : "";
            const response = await axios.get(`${API_BASE_URL}/admin/feedback/all?page=${page}&per_page=${perPage}${filterQuery1}${filterQuery2}`, { withCredentials: true });
            const data = response.data;
            setFeedbacks(data.feedbacks);
            setHasNext(data.has_next);
            setHasPrev(data.has_prev);
            setMessage("");
        } catch (error) {
            console.error(error);
            setMessage("An error occurred: " + error.response.data.message);
        }
    };

    const handleDeleteClick = (feedback_to_delete) => {
        setFeedbackToDelete(feedback_to_delete);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/admin/feedback/${feedbackToDelete.id}`, { withCredentials: true });
            setDeleteModalMessage("Feedback deleted successfully.");
            setTimeout(() => {
                setShowDeleteModal(false);
            }, 1000);
        } catch (error) {
            setDeleteModalMessage("An error occurred: " + error.message);
        }
    };

    useEffect(() => {
        if (!user) {
            setMessage("Please log in to view the feedbacks.");
        } else if (user.role !== "admin") {
            setMessage("You are not authorized to view the feedbacks.");
        } else {
            fetchFeedbacks(currentPage, perPage);
        }
    }, [user, currentPage, perPage, showDeleteModal, filterByUser, filterByStory]);

    useEffect(() => {
        if (showDeleteModal) {
            setDeleteModalMessage("");
        }
    }, [showDeleteModal]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (e) => {
        setPerPage(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterApply = () => {
        fetchFeedbacks(currentPage, perPage, filterByUser ? filterUserId : "", filterByStory ? filterStoryId : "");
    };

    const handleUserFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFilterByUser(checked);
        } else if (name === "filterUserId") {
            setFilterUserId(value);
        }
    };

    const handleStoryFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFilterByStory(checked);
        } else if (name === "filterStoryId") {
            setFilterStoryId(value);
        }
    }

    return (
        <Container fluid className="p-0 bg-container bg-2">
            <AdminSidebar />
            <Container className="text-center mt-5">
                <h1 className="text-blue-900 fw-900">FEEDBACKS</h1>
                <Row className="justify-content-center mt-4">
                    {message ? (
                        <h4 className="alert alert-danger">{message}</h4>
                    ) : (
                        <Col xs={12}>
                            <Button variant="primary" as={Link} to="/admin" className="mb-3"><i className="fa-solid fa-arrow-left me-2" />Back to Dashboard</Button>
                            <div className="d-flex justify-content-between align-items-center mb-3 alert alert-secondary p-2">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="checkbox"
                                        label="Filter by User ID"
                                        checked={filterByUser}
                                        onChange={handleUserFilterChange}
                                        className="fw-bold"
                                    />
                                    <Form.Control
                                        type="text"
                                        name="filterUserId"
                                        placeholder="User ID"
                                        value={filterUserId}
                                        onChange={handleUserFilterChange}
                                        disabled={!filterByUser}
                                        className="ms-2"
                                        style={{ width: "150px" }}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Filter by Story ID"
                                        checked={filterByStory}
                                        onChange={handleStoryFilterChange}
                                        className="fw-bold ms-3"
                                    />
                                    <Form.Control
                                        type="text"
                                        name="filterStoryId"
                                        placeholder="Story ID"
                                        value={filterStoryId}
                                        onChange={handleStoryFilterChange}
                                        disabled={!filterByStory}
                                        className="ms-2"
                                        style={{ width: "150px" }}
                                    />
                                    <Button
                                        variant="primary"
                                        className="ms-3"
                                        onClick={handleFilterApply}
                                    >
                                        Apply Filter
                                    </Button>
                                </div>
                                <div className="d-flex align-items-center">
                                    <Form.Label className="mb-0 me-2 fw-bold">Feedbacks per page:</Form.Label>
                                    <Form.Control as="select" value={perPage} onChange={handlePerPageChange} style={{ width: '80px' }}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </Form.Control>
                                </div>
                            </div>
                            <Table striped bordered hover className="text-start">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>On Story ID</th>
                                        <th>By User ID</th>
                                        <th>Rating</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.map((feedback) => (
                                        <tr key={feedback.id}>
                                            <td>{feedback.id}</td>
                                            <td>{feedback.story_id}</td>
                                            <td>{feedback.user_id}</td>
                                            <td>{feedback.rating}/5</td>
                                            <td>
                                                <Button variant="primary" className="me-2" as={Link} to={`/admin/feedback/${feedback.id}`}><i className="fa-solid fa-eye" /></Button>
                                                <Button variant="danger" onClick={() => handleDeleteClick(feedback)}><i className="fa-solid fa-trash" /></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Pagination className="justify-content-center">
                                {hasPrev && <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />}
                                <Pagination.Item active>{currentPage}</Pagination.Item>
                                {hasNext && <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />}
                            </Pagination>
                        </Col>
                    )}
                </Row>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {deleteModalMessage && <p className="alert alert-info">{deleteModalMessage}</p>}
                        Are you sure you want to delete the feedback with ID {feedbackToDelete?.id}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Container>
    );
};

export default AdminFeedback;