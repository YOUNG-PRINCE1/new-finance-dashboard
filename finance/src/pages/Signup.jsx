import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Google from '../assets/google.webp'
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = null;
      if (photo) {
        photoURL = photoPreview;
      }

      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });

      // 🔥 Get Firebase token
      const token = await user.getIdToken();
      localStorage.setItem("token", token); // 🧠 Save it for API use

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };


  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken(); // 🔥 Firebase token
      localStorage.setItem("token", token); // 🧠 Save it

      navigate("/");
    } catch (err) {
      console.error("Google sign-up error:", err);
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="p-4 rounded shadow-lg bg-secondary"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Create an Account</h3>

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
          <img
            src={Google }
            alt="Google logo"
            width={20}
            height={20}
          />
          Sign up with Google
        </button>

        <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: "0.9rem" }}>
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
