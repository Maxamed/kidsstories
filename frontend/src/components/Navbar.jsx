import React from "react";
import logo from "../assets/logo.svg";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo-container">
                <img src={logo} alt="logo" className="logo" />
                <div className="logo-text">
                    <span style={{ color: "rgba(224, 54, 54, 1)" }}>K</span>
                    <span style={{ color: "rgba(0, 123, 224, 1)" }}>I</span>
                    <span style={{ color: "rgba(247, 153, 0, 1)" }}>D</span>
                    <span style={{ color: "rgba(20, 191, 150, 1)" }}>
                        S
                    </span>{" "}
                    STORIES
                </div>
            </div>
            <div className="nav-links">
                <Link className="nav-link" to="/">
                    Home
                </Link>
                <Link className="nav-link" to="/pricing">
                    Pricing
                </Link>
                <Link className="nav-link" to="/history">
                    History
                </Link>
                <Link className="nav-link" to="/about-us">
                    About Us
                </Link>
                <Link className="login-button" to="/login">
                    Login
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
