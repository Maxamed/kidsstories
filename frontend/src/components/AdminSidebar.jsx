import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import LogoText from "./LogoText";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Navbar } from "react-bootstrap";

import logo from "../assets/logo.svg";

const AdminSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);

    const logoutHandler = async () => {
        await logout();
        navigate("/");
        window.location.reload();
    };

    return (
        <>
            <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start" scroll={true} backdrop={true} className="my-bg-2 my-color-2 fw-bold">
                <Offcanvas.Header closeButton />
                <Offcanvas.Body>
                    <Container>
                        <Nav className="flex-column">
                            <Nav.Link as={NavLink} to="/admin" className={(navData) => (navData.isActive ? "active" : "")} onClick={() => setShowSidebar(false)}><i className="fa-solid fa-gauge me-2" />Dashboard</Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/user" className={(navData) => (navData.isActive ? "active" : "")} onClick={() => setShowSidebar(false)}><i className="fa-solid fa-user me-2" />User</Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/story" className={(navData) => (navData.isActive ? "active" : "")} onClick={() => setShowSidebar(false)}><i className="fa-solid fa-book me-2" />Story</Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/feedback" className={(navData) => (navData.isActive ? "active" : "")} onClick={() => setShowSidebar(false)}><i className="fa-solid fa-comment me-2" />Feedback</Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/contact" className={(navData) => (navData.isActive ? "active" : "")} onClick={() => setShowSidebar(false)}><i className="fa-solid fa-phone me-2" />Contact</Nav.Link>
                            {user ? (
                                <Nav.Link className="login-button" onClick={logoutHandler}>Logout</Nav.Link>
                            ) : (
                                <Nav.Link as={NavLink} to="/login" className="login-button" onClick={() => setShowSidebar(false)}>Login</Nav.Link>
                            )}
                        </Nav>
                    </Container>
                </Offcanvas.Body>
            </Offcanvas>
            <Navbar className="my-bg-2" expand="false" key="admin">
                <Navbar.Toggle className="position-absolute ms-2" onClick={() => setShowSidebar(true)} />
                <Navbar.Brand className="d-flex align-items-center ms-auto me-auto" as={NavLink} to="/admin">
                    <img src={logo} alt="logo" height="40px" />
                    <LogoText classNames="ms-2 fs-4" extraText="Admin" />
                </Navbar.Brand>
            </Navbar >
        </>
    );
};

export default AdminSidebar;