import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {

  const name = '<YOUNG_PRINCE />'
  return (
    <footer className="bg-dark text-white py-3 mt-auto text-center">
      <div className="container">
        <p className="mb-1">&copy; {new Date().getFullYear()} Finance Tracker by {name}. All rights reserved.</p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/" className="text-white text-decoration-none">Home</Link>
          <Link to="/report" className="text-white text-decoration-none">Reports</Link>
          <Link to="/settings" className="text-white text-decoration-none">Settings</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
