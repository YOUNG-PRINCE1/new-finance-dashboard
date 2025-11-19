import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Google from "../assets/google.webp";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState(""); // ❗ Error catcher
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // 🔐 Password validation (must contain BOTH letters & numbers)
  const isPasswordValid = (password) => {
    const hasLetters = /[A-Za-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    return password.length >= 6 && hasLetters && hasNumbers;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Reset error each submit

    // ❗ PRE-VALIDATE PASSWORD BEFORE FIREBASE
    if (!isPasswordValid(password)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let photoURL = null;
      if (photo) {
        photoURL = photoPreview; // Preview only (you can upgrade to storage later)
      }

      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });

      // 🔥 Save Firebase ID token
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      navigate("/");
    } catch (err) {
      console.error(err);

      // 🔥 FRIENDLY ERROR HANDLING
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Try logging in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Minimum 6 characters.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Check your connection and try again.");
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError("Google signup failed. Try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="p-4 rounded shadow-lg bg-secondary"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Create an Account</h3>

        {/* 🔥 ERROR MESSAGE DISPLAY */}
        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-0 border-bottom"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

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
            <small className="text-light">
              Must include letters & numbers (min 6 chars)
            </small>
          </div>

          <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              className="form-control bg-dark text-white"
              onChange={handleImageChange}
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="mt-2 rounded-circle"
                width={60}
                height={60}
              />
            )}
          </div>

          <button type="submit" className="btn btn-success w-100 mt-3">
            Sign Up with Email
          </button>
        </form>

        <div className="text-center my-3">or</div>

        <button
          onClick={handleGoogleSignup}
          className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <img src={Google} alt="Google logo" width={20} height={20} />
          Sign up with Google
        </button>

        <p
          className="text-center text-muted mt-4 mb-0"
          style={{ fontSize: "0.9rem" }}
        >
          Already have an account?{" "}
          <Link to="/login" className="text-white">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
