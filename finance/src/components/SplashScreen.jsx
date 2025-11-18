// src/components/SplashScreen.jsx
import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
  const [fade, setFade] = useState(false);

 
  const loaders = ['pulse', 'coin', 'logo-spin', 'ripple'];
//   const selected = loaders[Math.floor(Math.random() * loaders.length)];
    const selected = 'coin'; 


  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`splash-screen d-flex flex-column justify-content-center align-items-center ${fade ? 'fade-out' : ''}`}>
      <div className="text-center">
        <h1 className="display-4 fw-bold text-light mb-2">💸 Finance Tracker</h1>
        <p className="text-light mb-4">Track. Save. Grow.</p>

        {/* Show the selected animation */}
        <div className={`custom-loader ${selected}`}></div>
      </div>
    </div>
  );
};

export default SplashScreen;
