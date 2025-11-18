import React, { useState } from "react";
import { auth, storage } from "../firebase";
import { updateProfile, updatePassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Settings = () => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // Upload image to Firebase Storage
      if (image) {
        const imgRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(imgRef, image);
        const url = await getDownloadURL(imgRef);
        await updateProfile(user, { photoURL: url });
      }

      // Update display name
      if (displayName && displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // Update password
      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      alert("Profile updated!");
      window.location.reload();
    } catch (err) {
      alert("Error updating: " + err.message);
    }
  };

  const toggleTheme = () => {
    const enabled = !darkMode;
    setDarkMode(enabled);
    localStorage.setItem("darkMode", enabled);
    document.body.classList.toggle("bg-dark", enabled);
    document.body.classList.toggle("text-light", enabled);
  };

  return (
    <div className="container mt-5">
      <h2>Settings</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">Display Name</label>
          <input
            type="text"
            className="form-control"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Profile Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={darkMode}
            onChange={toggleTheme}
            id="darkModeSwitch"
          />
          <label className="form-check-label" htmlFor="darkModeSwitch">
            Enable Dark Mode
          </label>
            {/* <button onClick={toggleTheme}>
                {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button> */}

        </div>

        <button type="submit" className="btn btn-primary">Update Settings</button>
      </form>
    </div>
  );
};

export default Settings;
