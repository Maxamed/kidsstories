import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const StoryGenerateContext = createContext();

export const useStoryGenerate = () => {
    const context = useContext(StoryGenerateContext);
    if (!context) {
        throw new Error("useStoryGenerate must be used within a StoryGenerateProvider");
    }
    return context;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL;

export const StoryGenerateProvider = ({ children }) => {
    const [storyGenerateData, setStoryGenerateData] = useState({
        child_name: "",
        child_age: "",
        story_moral: "",
        story_genre: "",
        story_length: "short",
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [storyResponse, setStoryResponse] = useState(null);

    const handleStoryGenerateDataChange = (e) => {
        const { name, value } = e.target;
        setStoryGenerateData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const generateStory = async (user, csrfToken) => {
        const endpoint = user
            ? `${API_BASE_URL}/story/generate`
            : `${API_BASE_URL}/story/generate-partial`;

        setIsGenerating(true);
        setError(null);
        setStoryResponse(null);
        if (!storyGenerateData.child_name || !storyGenerateData.child_age || !storyGenerateData.story_moral || !storyGenerateData.story_genre) {
            setError("All fields are required");
            setIsGenerating(false);
            return;
        }
        try {
            const response = await axios.post(endpoint, storyGenerateData, {
                withCredentials: true,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            const storyObj = {
                title: response.data.story.title,
                paragraphs: response.data.story.content.split("\n"),
                type: response.data.story.type,
            }
            if (storyObj.type === "full") {
                storyObj.storyID = response.data.story.id;
                storyObj.imageURL = `${ASSETS_BASE_URL}/images/${response.data.story.image}`;
            }
            setStoryResponse(storyObj);
        }
        catch (err) {
            console.error("Generate story failed:", err);
            setError(err.response?.data?.message || "An error occurred");
        }
        finally {
            setIsGenerating(false);
            if (!error) {
                setStoryGenerateData({
                    child_name: "",
                    child_age: "",
                    story_moral: "",
                    story_genre: "",
                    story_length: "short",
                });
            }
        }
    };

    const value = {
        storyGenerateData,
        isGenerating,
        error,
        storyResponse,
        handleStoryGenerateDataChange,
        generateStory,
    };

    return (
        <StoryGenerateContext.Provider value={value}>
            {children}
        </StoryGenerateContext.Provider>
    );
};

StoryGenerateProvider.propTypes = {
    children: PropTypes.node.isRequired,
};