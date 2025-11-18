// pages/Login.jsx

import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Google from '../assets/google.webp'


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); 
      localStorage.setItem("token", token);   

      navigate("/");
    } catch (err) {
      alert("Login failed. Check credentials.");
      console.error(err);
    }
  };

  // Google login
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken(); 
      localStorage.setItem("token", token);   

      navigate("/");
    } catch (err) {
      console.error("Google sign-in error:", err);
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div className="p-4 rounded shadow-lg bg-secondary" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Login to Finance Tracker</h3>

        <form onSubmit={handleEmailLogin}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-0 border-bottom"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-0 border-bottom"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Login with Email
          </button>
        </form>

        <div className="text-center my-3">or</div>

        <button
          onClick={handleGoogleSignIn}
          className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <img
            src={Google}
            alt="Google logo"
            width="20"
            height="20"
          />
          Sign in with Google
        </button>

        <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: "0.9rem" }}>
          Don't have an account? <a href="/signup" className="text-white">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
