import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Import social media icons

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#1e1e1e', // Dark gray background
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        borderTop: '1px solid #333', // Add a subtle border
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '10px',
        }}
      >
        {/* Social Media Links */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'white',
            textDecoration: 'none',
            transition: 'transform 0.2s, filter 0.2s', // Smooth transition
          }}
          className="icon-hover" // Add a class for hover effect
        >
          <FaFacebook size={24} />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'white',
            textDecoration: 'none',
            transition: 'transform 0.2s, filter 0.2s', // Smooth transition
          }}
          className="icon-hover" // Add a class for hover effect
        >
          <FaTwitter size={24} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'white',
            textDecoration: 'none',
            transition: 'transform 0.2s, filter 0.2s', // Smooth transition
          }}
          className="icon-hover" // Add a class for hover effect
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'white',
            textDecoration: 'none',
            transition: 'transform 0.2s, filter 0.2s', // Smooth transition
          }}
          className="icon-hover" // Add a class for hover effect
        >
          <FaLinkedin size={24} />
        </a>
      </div>

      {/* Copyright Notice */}
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>
        &copy; {new Date().getFullYear()} Spectra. All rights reserved.
      </p>

      {/* Add CSS for hover effect */}
      <style>
        {`
          .icon-hover:hover {
            transform: translateY(-2px); /* Slight lift */
            filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3)); /* Slight shadow */
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;