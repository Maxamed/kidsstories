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

const AdminContact = () => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [message, setMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteModalMessage, setDeleteModalMessage] = useState("");
    const [contactToDelete, setContactToDelete] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchContacts = async (page, perPage) => {
        try {
            setMessage("Loading contacts...");
            const response = await axios.get(`${API_BASE_URL}/admin/contact/all?page=${page}&per_page=${perPage}`, { withCredentials: true });
            const data = response.data;
            setContacts(data.contacts);
            setHasNext(data.has_next);
            setHasPrev(data.has_prev);
            setMessage("");
        } catch (error) {
            console.error(error);
            setMessage("An error occurred: " + error.response.data.message);
        }
    };

    const handleDeleteClick = (contact_to_delete) => {
        setContactToDelete(contact_to_delete);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/admin/contact/${contactToDelete.id}`, { withCredentials: true });
            setDeleteModalMessage("Contact deleted successfully.");
            setTimeout(() => {
                setShowDeleteModal(false);
            }, 1000);
        } catch (error) {
            setDeleteModalMessage("An error occurred: " + error.response.data.message);
        }
    }

    useEffect(() => {
        if (!user) {
            setMessage("Please log in to view the contacts.");
        } else if (user.role !== "admin") {
            setMessage("You are not authorized to view the contacts.");
        } else {
            fetchContacts(currentPage, perPage);
        }
    }, [user, currentPage, perPage, showDeleteModal]);

    useEffect(() => {
        if (showDeleteModal) {
            setDeleteModalMessage("");
        }
    }, [showDeleteModal]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchUsers(page, perPage);
    };

    const handlePerPageChange = (e) => {
        setPerPage(e.target.value);
        setCurrentPage(1);
    };

    return (
        <Container fluid className="p-0 bg-container bg-2">
            <AdminSidebar />
            <Container className="text-center mt-5">
                <h1 className="text-blue-900 fw-900">CONTACTS</h1>
                <Row className="justify-content-center mt-4">
                    {message ? (
                        <h4 className="alert alert-danger">{message}</h4>
                    ) : (
                        <Col xs={12}>
                            <Button variant="primary" as={Link} to="/admin" className="mb-3"><i className="fa-solid fa-arrow-left me-2" />Back to Dashboard</Button>
                            <div className="d-flex justify-content-end align-items-center mb-3 alert alert-secondary p-2">
                                <Form.Label className="mb-0 me-2 fw-bold">Contacts per page:</Form.Label>
                                <Form.Control as="select" value={perPage} onChange={handlePerPageChange} style={{ width: '80px' }}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </Form.Control>
                            </div>
                            <Table striped bordered hover className="text-start">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((contact) => (
                                        <tr key={contact.id}>
                                            <td>{contact.id}</td>
                                            <td>{contact.name}</td>
                                            <td>{contact.email}</td>
                                            <td>
                                                <Button variant="primary" className="me-2" as={Link} to={`/admin/contact/${contact.id}`}><i className="fa-solid fa-eye" /></Button>
                                                <Button variant="danger" onClick={() => handleDeleteClick(contact)}><i className="fa-solid fa-trash" /></Button>
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
                        Are you sure you want to delete the contact with ID {contactToDelete?.id}?
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

export default AdminContact;