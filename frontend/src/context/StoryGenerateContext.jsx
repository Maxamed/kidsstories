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
        story_moral_custom: "",
        story_genre: "",
        story_genre_custom: "",
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

    const getFinalStoryData = (data) => ({
        child_name: data.child_name,
        child_age: data.child_age,
        story_moral: data.story_moral === "custom" ? data.story_moral_custom : data.story_moral,
        story_genre: data.story_genre === "custom" ? data.story_genre_custom : data.story_genre,
        story_length: data.story_length,
    });

    const generateStory = async (user) => {
        const endpoint = user
            ? `${API_BASE_URL}/story/generate`
            : `${API_BASE_URL}/story/generate-partial`;

        setIsGenerating(true);
        setError(null);
        setStoryResponse(null);
        if (!storyGenerateData.child_name || !storyGenerateData.child_age || !storyGenerateData.story_moral || !storyGenerateData.story_genre || (storyGenerateData.story_moral === "custom" && !storyGenerateData.story_moral_custom) || (storyGenerateData.story_genre === "custom" && !storyGenerateData.story_genre_custom)) {
            setError("All fields are required");
            setIsGenerating(false);
            return;
        }
        try {
            const response = await axios.post(endpoint, getFinalStoryData(storyGenerateData), { withCredentials: true });
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
            if (!user) {
                localStorage.setItem("storyGenerateData", JSON.stringify(getFinalStoryData(storyGenerateData)));
            }
        }
        catch (err) {
            console.error("Generate story failed:", err);
            setError(err.response?.data?.message || "An error occurred");
        }
        finally {
            setIsGenerating(false);
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
