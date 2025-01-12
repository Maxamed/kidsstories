import React, { useState, useEffect, useRef } from "react";
import MyNavbar from "../components/MyNavbar";
import Feedback from "../components/Feedback";
import Share from "../components/Share";
import AudioPlayer from "../components/AudioPlayer";
import { useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PlayIcon from "../assets/play.svg";
import DownloadIcon from "../assets/download.svg";

import axios from "axios";

const Story = () => {
    const [storyData, setStoryData] = useState({});
    const [message, setMessage] = useState("Loading story...");
    const [downloadMessage, setDownloadMessage] = useState("");
    const [narrateMessage, setNarrateMessage] = useState("");
    const [narrationAudio, setNarrationAudio] = useState(null);
    const [narrationCurrentTime, setNarrationCurrentTime] = useState(0);
    const [narrationDuration, setNarrationDuration] = useState(0);
    const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
    const [highlightedParagraph, setHighlightedParagraph] = useState(null);
    const { id } = useParams();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL;
    const cumulativeDurationsRef = useRef([]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const fetchStory = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/story/${id}`, { withCredentials: true });
            const storyRes = response.data.story;
            setStoryData(storyRes);
            setMessage("");
            const paragraphs = storyRes.content.split("\n");
            const imageURL = `${ASSETS_BASE_URL}/images/${storyRes.image}`;
            const createdAt = formatDate(storyRes.timestamp);
            setStoryData({ ...storyRes, paragraphs, imageURL, createdAt });
        } catch (error) {
            console.error(error);
            setMessage("Story not found!");
        }
    };

    const handleDownloadStory = async () => {
        try {
            setDownloadMessage("Downloading Story...");
            const response = await axios.get(`${API_BASE_URL}/story/download/${id}`, {
                withCredentials: true,
                responseType: "blob"
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.download = `${storyData.title}.pdf`;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            tempLink.remove();
            window.URL.revokeObjectURL(url);
            setDownloadMessage("");
        } catch (error) {
            console.error(error);
            setDownloadMessage("Failed to download story!");
        }
    };

    const handleNarrateStory = async () => {
        setNarrateMessage("Loading Narration...");
        try {
            const response = await axios.post(`${API_BASE_URL}/story/narrate/${id}`, { withCredentials: true });
            const narrationData = response.data;
            let audioURL = `${ASSETS_BASE_URL}/audios/${narrationData.audio}`;
            const audioBlob = await fetch(audioURL).then(res => res.blob());
            audioURL = URL.createObjectURL(audioBlob);

            const durationsData = narrationData.durations;
            cumulativeDurationsRef.current = durationsData.reduce((acc, val, i) => {
                acc.push((acc[i - 1] || 0) + val);
                return acc;
            }, []);

            setNarrationAudio(audioURL);
            setNarrateMessage("");
        } catch (error) {
            console.error(error);
            setNarrateMessage("Error narrating story!");
        }
    };

    const findParagraph = (currentTime, cumulativeDurations) => {
        if (!cumulativeDurations.length) return null;
        for (let i = 0; i < cumulativeDurations.length; i++) {
            if (currentTime <= cumulativeDurations[i]) {
                return i;
            }
        }
        return cumulativeDurations.length - 1;
    };

    useEffect(() => {
        fetchStory();
    }, []);

    useEffect(() => {
        if (downloadMessage == "Failed to download story!") {
            setTimeout(() => {
                setDownloadMessage("");
            }, 3000);
        }
    }, [downloadMessage]);

    useEffect(() => {
        if (isNarrationPlaying) {
            const paragraphIndex = findParagraph(narrationCurrentTime, cumulativeDurationsRef.current);
            setHighlightedParagraph(paragraphIndex);
        } else {
            setHighlightedParagraph(null);
        }
    }, [isNarrationPlaying, narrationCurrentTime]);

    return (
        <Container fluid className="p-0 bg-container bg-3">
            <MyNavbar />
            <Container className="text-center mt-5 pb-5">
                <h1 className="text-blue-900 fw-900">STORY</h1>
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={8}>
                        <div className="card-container mt-4 p-sm-5 p-4 py-5">
                            <h2 className="my-card-title">View, Download or Share Your Story</h2>

                            {message ? (
                                <h4 className="my-card-title my-4">{message}</h4>
                            ) : (
                                <>
                                    <Row className="my-4 button-bar align-items-center">
                                        <Col xs={2} md={2} lg={1}></Col>
                                        <Col xs={2} md={2} lg={4}>
                                            <div className="green-button py-1 px-1 px-lg-2 d-none d-lg-block" style={{ cursor: "pointer" }} onClick={handleDownloadStory}>
                                                {downloadMessage ? downloadMessage : "Download Story"}
                                            </div>
                                            <img src={DownloadIcon} alt="Download Icon" style={{ cursor: "pointer" }} className="d-lg-none" onClick={handleDownloadStory} />
                                        </Col>
                                        <Col className="d-none d-lg-block" lg={3}></Col>
                                        <Col xs={2} md={2} lg={1}>
                                            <img src={PlayIcon} alt="Play Icon" style={{ cursor: "pointer" }} onClick={handleNarrateStory} />
                                        </Col>
                                        <Col xs={2} md={2} lg={1}>
                                            <Share storyId={id} />
                                        </Col>
                                        <Col xs={2} md={2} lg={1}>
                                            <Feedback storyId={id} />
                                        </Col>
                                        <Col xs={2} md={2} lg={1}></Col>
                                    </Row>
                                    {narrateMessage && <div className="alert alert-info">{narrateMessage}</div>}
                                    {narrationAudio && (<>
                                        <h4 className="my-card-title my-2">Listen to the Story!</h4>
                                        <AudioPlayer
                                            audioUrl={narrationAudio}
                                            narrationCurrentTime={narrationCurrentTime}
                                            setNarrationCurrentTime={setNarrationCurrentTime}
                                            narrationDuration={narrationDuration}
                                            setNarrationDuration={setNarrationDuration}
                                            isNarrationPlaying={isNarrationPlaying}
                                            setIsNarrationPlaying={setIsNarrationPlaying}
                                        />
                                    </>)}
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
                                                    className="story-preview-content-text p-1"
                                                    key={index}
                                                    style={{ backgroundColor: highlightedParagraph === index ? "#feffad" : "transparent" }}
                                                >{para}</p>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container >
        </Container >
    )
}

export default Story;