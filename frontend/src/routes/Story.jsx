import React, { useState, useEffect, useRef } from "react";
import MyNavbar from "../components/MyNavbar";
import Feedback from "../components/Feedback";
import AudioPlayer from "../components/AudioPlayer";
import { useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ShareIcon from "../assets/share.svg";
import PlayIcon from "../assets/play.svg";

import axios from "axios";

const Story = () => {
    const [storyData, setStoryData] = useState({});
    const [message, setMessage] = useState("Loading story...");
    const [copyMessage, setCopyMessage] = useState("");
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
        setDownloadMessage("Downloading Story...");
        try {
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
        } catch (error) {
            console.error(error);
            setDownloadMessage("Failed to download story!");
        }
    };

    const handleNarrateStory = async () => {
        setNarrateMessage("Loading Narration...");
        try {
            const response = await axios.get(`${API_BASE_URL}/story/narrate/${id}`, {
                withCredentials: true,
                responseType: "arraybuffer",
            });

            const contentType = response.headers["content-type"];
            const boundary = contentType.match(/boundary=(.+)/)[1];

            const data = new Uint8Array(response.data);
            const decoder = new TextDecoder("utf-8");
            const decodedData = decoder.decode(data);
            const parts = decodedData.split(`--${boundary}`);

            const jsonPart = parts.find(part => part.includes("application/json"));
            const jsonContent = jsonPart.split("\r\n\r\n")[1].trim();
            const durationsData = JSON.parse(jsonContent)["durations"];
            cumulativeDurationsRef.current = durationsData.reduce((acc, val, i) => {
                acc.push((acc[i - 1] || 0) + val);
                return acc;
            }, []);

            const audioPart = parts.find(part => part.includes("audio/wav"));
            const audioIndex = decodedData.indexOf(audioPart) + audioPart.indexOf("\r\n\r\n") + 4;
            const audioBlob = new Blob([data.subarray(audioIndex)], { type: "audio/wav" });

            const audioURL = URL.createObjectURL(audioBlob);
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

    const handleCopyLink = () => {
        const link = `${window.location.origin}/story/${id}`;
        navigator.clipboard.writeText(link);
        setCopyMessage("Link Copied to Clipboard!");
    }

    useEffect(() => {
        fetchStory();
    }, []);

    useEffect(() => {
        if (isNarrationPlaying) {
            const paragraphIndex = findParagraph(narrationCurrentTime, cumulativeDurationsRef.current);
            setHighlightedParagraph(paragraphIndex);
        } else {
            setHighlightedParagraph(null);
        }
    }, [isNarrationPlaying, narrationCurrentTime]);


    useEffect(() => {
        if (copyMessage) {
            const timeout = setTimeout(() => {
                setCopyMessage("");
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [copyMessage]);

    useEffect(() => {
        if (downloadMessage) {
            const timeout = setTimeout(() => {
                setDownloadMessage("");
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [downloadMessage]);

    return (
        <Container fluid className="p-0 bg-container bg-3">
            <MyNavbar />
            <Container className="text-center mt-5 pb-5">
                <h1 className="title-page">STORY</h1>
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={8}>
                        <div className="card-container mt-4 p-sm-5 p-4 py-5">
                            <h2 className="my-card-title">View, Download or Share Your Story</h2>

                            {message ? (
                                <h4 className="my-card-title my-4">{message}</h4>
                            ) : (
                                <>
                                    <Row className="my-4 button-bar align-items-center">
                                        <Col className="d-none d-lg-block" md={1} lg={1}></Col>
                                        <Col xs={6} md={6} lg={4}>
                                            <div className="green-button py-1 px-1 px-lg-2" onClick={handleDownloadStory}>
                                                Download PDF
                                            </div>
                                        </Col>
                                        <Col className="d-none d-lg-block" md={3} lg={3}></Col>
                                        <Col xs={2} md={2} lg={1}>
                                            <img src={PlayIcon} alt="Play Icon" onClick={handleNarrateStory} />
                                        </Col>
                                        <Col xs={2} md={2} lg={1}>
                                            <img src={ShareIcon} alt="Share Icon" onClick={handleCopyLink} />
                                        </Col>
                                        <Col xs={2} md={2} lg={1}>
                                            <Feedback storyId={id} />
                                        </Col>
                                        <Col className="d-none d-lg-block" md={1} lg={1}></Col>
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
                                                    className="story-preview-content-text"
                                                    key={index}
                                                    style={{ backgroundColor: highlightedParagraph === index ? "#f8d7da" : "transparent" }}
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