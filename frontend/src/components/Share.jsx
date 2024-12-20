import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ShareIcon from "../assets/share.svg";
import CopyIcon from "../assets/copy.svg";

import axios from "axios";
import {
    FacebookShareButton,
    WhatsappShareButton,
    TwitterShareButton,
    EmailShareButton,
    FacebookIcon,
    WhatsappIcon,
    XIcon,
    EmailIcon
} from "react-share";

const Share = ({ storyId }) => {
    const [modalShow, setModalShow] = useState(false);
    const [message, setMessage] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleShareLink = async () => {
        setModalShow(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/story/publish/${storyId}`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error(error);
            setMessage("Failed to publish story, please try again later.");
        }
    };

    const handleModalClose = () => {
        setModalShow(false);
        setMessage("");
    }

    return (
        <>
            <img src={ShareIcon} alt="Share" style={{ cursor: "pointer" }} onClick={handleShareLink} />
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                show={modalShow}
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Share this Story with others!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message && <p className="alert alert-danger">{message}</p>}

                    <div className="d-flex justify-content-center">
                        <img src={CopyIcon} alt="Copy" style={{ cursor: "pointer" }} onClick={() => navigator.clipboard.writeText(`${window.location.origin}/story/shared/${storyId}`)} className="mx-1 w-32px" />
                        <FacebookShareButton url={`${window.location.origin}/story/shared/${storyId}`}>
                            <FacebookIcon size={32} round className="mx-1" />
                        </FacebookShareButton>
                        <WhatsappShareButton url={`${window.location.origin}/story/shared/${storyId}`}>
                            <WhatsappIcon size={32} round className="mx-1" />
                        </WhatsappShareButton>
                        <TwitterShareButton url={`${window.location.origin}/story/shared/${storyId}`}>
                            <XIcon size={32} round className="mx-1" />
                        </TwitterShareButton>
                        <EmailShareButton url={`${window.location.origin}/story/shared/${storyId}`}>
                            <EmailIcon size={32} round className="mx-1" />
                        </EmailShareButton>
                    </div>

                    <div className="d-flex justify-content-end">
                        <Button variant="danger" onClick={handleModalClose}>
                            Close
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Share