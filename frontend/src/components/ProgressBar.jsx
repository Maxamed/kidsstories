import React from 'react';
import '../styles/ProgressBar.css';

const ProgressBar = (props) => {
    const { bgcolor, completed } = props;

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar-filler"
                style={{ width: `${completed}%`, backgroundColor: bgcolor }}
            />
        </div>
    );
};

export default ProgressBar;
