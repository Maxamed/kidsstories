import React from "react";
import PropTypes from "prop-types";

const ActionButton = ({ buttonText, icon, clickHandler, className = "" }) => {
    return (
        <div
            onClick={clickHandler}
            className={`green-button d-flex align-items-center justify-content-center px-2 py-1 mx-1 flex-fill ${className}`}
            title={buttonText}
        >
            {icon && <img src={icon} alt={`${buttonText} Icon`} className="" />}
            <div className="ms-2 d-none d-lg-block">{buttonText}</div>
        </div>
    );
};

ActionButton.propTypes = {
    buttonText: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    clickHandler: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default ActionButton;
