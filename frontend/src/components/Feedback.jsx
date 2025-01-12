import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Rating } from 'react-simple-star-rating'
import FeedbackIcon from "../assets/feedback.svg";

import axios from "axios";

const Feedback = ({ storyId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
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
            setErrorMessage("Please provide a rating.");
            return;
        }
        if (comment.trim() === "") {
            setErrorMessage("Please provide a comment.");
            return;
        }
        const feedbackData = {
            "rating": rating,
            "comment": comment,
            "story_id": storyId
        };
        try {
            axios.post(`${API_BASE_URL}/feedback/submit`, feedbackData, {
                withCredentials: true
            });
            setMessage("Feedback submitted successfully.");
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to submit feedback.");
        }
        setComment("");
        setRating(0);
    };

    const handleModalClose = () => {
        setModalShow(false);
        setComment("");
        setMessage("");
        setErrorMessage("");
        setRating(0);
    }

    useEffect(() => {
        if (message || errorMessage) {
            setTimeout(() => {
                setMessage("");
                setErrorMessage("");
            }, 3000);
        }
    }, [message, errorMessage]);

    return (
        <>
            <img src={FeedbackIcon} alt="Feedback Icon" style={{ cursor: "pointer" }} onClick={() => setModalShow(true)} />
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
                    {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
                    {message && <p className="alert alert-success">{message}</p>}
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