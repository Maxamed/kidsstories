import React, { useEffect, useRef } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

import PlayIcon from "../assets/play_icon.svg";
import PauseIcon from "../assets/pause_icon.svg";

const AudioPlayer = ({ audioUrl, narrationCurrentTime, setNarrationCurrentTime, narrationDuration, setNarrationDuration, isNarrationPlaying, setIsNarrationPlaying }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            setNarrationCurrentTime(audio.currentTime);
        };

        const setAudioDuration = () => {
            setNarrationDuration(audio.duration);
        };

        const resetPlayer = () => {
            setIsNarrationPlaying(false);
            setNarrationCurrentTime(0);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', setAudioDuration);
        audio.addEventListener('ended', resetPlayer);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', setAudioDuration);
            audio.removeEventListener('ended', resetPlayer);
        };
    }, []);

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (isNarrationPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsNarrationPlaying(!isNarrationPlaying);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const barWidth = document.getElementById('progress-bar').offsetWidth;
        const barOffset = document.getElementById('progress-bar').offsetLeft;
        const newTime = (e.clientX - barOffset) / barWidth * narrationDuration;
        console.log(e.clientX, barOffset, barWidth, newTime);
        audio.currentTime = newTime;
        setNarrationCurrentTime(newTime);
    };

    return (
        <div className="audio-player d-flex align-items-center justify-content-between mb-4">
            <audio ref={audioRef} src={audioUrl} id="audio" />
            <button onClick={handlePlayPause} className="play-pause-button me-3">
                {!isNarrationPlaying ? (
                    <img src={PlayIcon} alt="Play Icon" />
                ) : (
                    <img src={PauseIcon} alt="Pause Icon" />
                )}
            </button>
            <div className="progress-bar-container w-100"
                onClick={handleSeek} onDrag={handleSeek} id="progress-bar">
                <ProgressBar
                    now={(narrationCurrentTime / narrationDuration) * 100}
                    max={100}
                    striped
                    variant="success"
                />
            </div>
        </div>
    );
};

export default AudioPlayer;
