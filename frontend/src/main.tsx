import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import heroImage from './assets/hero-image-vibrant.jpg'; // Import the image

// Set the background image as a CSS variable on the body
document.body.style.setProperty('--global-bg-image', `url(${heroImage})`);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
