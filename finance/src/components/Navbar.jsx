import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import avatar from "../assets/default-avatar.png"

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `avatars/${user.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await updateProfile(user, { photoURL: url });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark px-4">
      <Link className="navbar-brand fw-bold" to='/'>💸 Finance Tracker</Link>

      <div className="ms-auto d-flex align-items-center gap-3">
        {user && (
          <>
            {/* Separate Dropdown */}
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i className="bi bi-list"></i> 
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                <li><Link className="dropdown-item" to="/report">Report</Link></li>
                <hr />
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </div>

            {/* User Info */}
            <span className="text-white fw-semibold">{user.displayName}</span>
            <img
              src={user.photoURL || avatar}
              alt="User"
              className="rounded-circle"
              width={32}
              height={32}
              onError={(e) => e.target.src = "/default-avatar.png"}
              referrerPolicy="no-referrer"
            />
          </>
        )}
        {/* <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
          Logout
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
