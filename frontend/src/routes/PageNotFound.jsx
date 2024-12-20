import React from "react";
import MyNavbar from "../components/MyNavbar";

import Container from "react-bootstrap/Container";

const PageNotFound = () => {
    return (
        <Container fluid className="p-0 bg-container bg-6">
            <MyNavbar />
            <Container className="text-center mt-5">
            </Container>
        </Container>
    )
}

export default PageNotFound