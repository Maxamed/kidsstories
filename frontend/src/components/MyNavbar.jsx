import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import LogoText from "./LogoText";
import { useAuth } from "../context/AuthContext";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import logo from "../assets/logo.svg";


const MyNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        await logout();
        navigate("/");
        window.location.reload();
    };

    const profileHandler = () => {
        if (user.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/profile");
        }
    };

    return (
        <Navbar expand="lg" className="my-bg-2 fw-bold my-color-2">
            <Container>
                <Navbar.Brand className="d-flex align-items-center justify-content-between" as={NavLink} to="/">
                    <img src={logo} alt="logo" height="40px" />
                    <LogoText classNames="ms-2 fs-4" />
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <Nav.Link as={NavLink} to="/" className={(navData) => (navData.isActive ? "active" : "")}>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/about-us" className={(navData) => (navData.isActive ? "active" : "")}>About Us</Nav.Link>
                        <Nav.Link as={NavLink} to="/faq" className={(navData) => (navData.isActive ? "active" : "")}>FAQ</Nav.Link>
                        <Nav.Link as={NavLink} to="/pricing" className={(navData) => (navData.isActive ? "active" : "")}>Pricing</Nav.Link>
                        <Nav.Link as={NavLink} to="/blog" className={(navData) => (navData.isActive ? "active" : "")}>Blog</Nav.Link>
                        <Nav.Link as={NavLink} to="/contact-us" className={(navData) => (navData.isActive ? "active" : "")}>Contact</Nav.Link>
                        {user && (
                            <Nav.Link as={NavLink} to="/my-stories" className={(navData) => (navData.isActive ? "active" : "")}>My Stories</Nav.Link>
                        )}
                        {user ? (
                            <>
                                <Nav.Link className="logged-user" onClick={profileHandler}>&nbsp;&nbsp;{user.name}&nbsp;&nbsp;</Nav.Link>
                                <Nav.Link className="login-button" onClick={logoutHandler}>Logout</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={NavLink} to="/login" className="login-button">Login</Nav.Link>
                        )}

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
