import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Rating } from 'react-simple-star-rating'
import FeedbackIcon from "../assets/feedback.svg";

import { useAuth } from "../context/AuthContext";

import axios from "axios";

const Feedback = ({ storyId }) => {
    const { csrfToken } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [message, setMessage] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (rating === 0) {
            setMessage("Please provide a rating.");
            return;
        }
        if (comment.trim() === "") {
            setMessage("Please provide a comment.");
            return;
        }
        const feedbackData = {
            "rating": rating,
            "comment": comment,
            "story_id": storyId
        };
        try {
            axios.post(`${API_BASE_URL}/feedback/submit`, feedbackData, {
                withCredentials: true,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
        } catch (error) {
            console.error(error);
            setMessage("Failed to submit feedback.");
        }

        setModalShow(false);
        setComment("");
        setRating(0);
    };

    const handleModalClose = () => {
        setModalShow(false);
        setComment("");
        setMessage("");
        setRating(0);
    }

    return (
        <>
            <div className="my-bg p-2 rounded-circle" onClick={() => setModalShow(true)}>
                <img src={FeedbackIcon} alt="Feedback Icon" />
            </div>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                show={modalShow}
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Feedback
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message && <p className="alert alert-danger">{message}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating:&nbsp;&nbsp;</Form.Label>
                            <Rating onClick={handleRatingChange} ratingValue={rating} initialValue={rating} transition allowFraction size={30} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={handleCommentChange}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="danger" onClick={handleModalClose}>
                                Close
                            </Button>
                            <Button variant="success" type="submit" className="ms-2">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Feedback;