import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Auth.css";
import bg from "../assets/bg-1.png";

const Register = () => {
    return (
        <>
            <Navbar />
            <img src={bg} alt="background" class="bg-img" />
            <h1 class="title-auth">REGISTER</h1>
            <div class="auth">
                <input type="email" class="auth-input" placeholder="Email" />
                <input
                    type="password"
                    class="auth-input"
                    placeholder="Password"
                />
                <input
                    type="password"
                    class="auth-input"
                    placeholder="Confirm Password"
                />
                <div class="auth-button" tabIndex={0}>
                    Register
                </div>
                <div>Or</div>
                <div class="oauth-button" tabIndex={0}>
                    <img
                        src="https://img.icons8.com/color/48/000000/google-logo.png"
                        alt="google"
                        class="oauth-icon"
                    />
                    <div class="oauth-text">Continue with Google</div>
                </div>
                <div class="oauth-button" tabIndex={0}>
                    <img
                        src="https://img.icons8.com/metro/100/mac-os.png"
                        alt="apple"
                        class="oauth-icon"
                    />
                    <div class="oauth-text">Continue with Apple</div>
                </div>
                <div class="auth-call-to">
                    Already have an account?{" "}
                    <Link class="auth-call-to-button" to="/login">
                        Login!
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Register;
