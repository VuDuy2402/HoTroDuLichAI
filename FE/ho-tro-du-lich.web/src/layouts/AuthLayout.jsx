// src/components/AuthLayout.jsx
import React from 'react';
import backgroundImage from '../assets/img/Background_1.png';

const AuthLayout = ({ children }) => {
  const layoutStyles = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    background: `url(${backgroundImage}) no-repeat center center fixed`,
    backgroundSize: 'cover',
  };

  const contentStyles = {
    height: '90vh',
    width: '100%',
    maxWidth: '600px',
    borderRadius: '8px',
  };

  return (
    <div style={layoutStyles}>
      <div style={contentStyles}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;