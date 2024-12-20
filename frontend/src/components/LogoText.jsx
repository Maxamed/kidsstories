import React from 'react'

const LogoText = ({ classNames, extraText }) => {
    return (
        <span className={classNames} style={{ fontWeight: "900" }}>
            <span style={{ color: "rgba(224, 54, 54, 1)" }}>K</span>
            <span style={{ color: "rgba(0, 123, 224, 1)" }}>I</span>
            <span style={{ color: "rgba(247, 153, 0, 1)" }}>D</span>
            <span style={{ color: "rgba(20, 191, 150, 1)" }}>S</span>
            <span style={{ color: "rgba(0, 0, 0, 1)", fontWeight: "500" }}>&nbsp;STORIES</span>
            {extraText && <span style={{ color: "rgba(0, 0, 0, 1)", fontWeight: "500" }}>&nbsp;|&nbsp;</span>}
            {extraText && <span style={{ color: "rgba(0, 0, 0, 1)", fontWeight: "300" }}>{extraText}</span>}
        </span>
    )
}

export default LogoText