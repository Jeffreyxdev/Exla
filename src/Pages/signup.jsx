
// Import necessary modules
import React from 'react';
import { FaUser, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const signup = () => {
  const handleSignupChoice = (choice) => {
    // Redirect user based on their choice
    if (choice === 'individual') {
      console.log('Redirecting to individual signup page...');
      // Replace with your actual navigation logic
    } else if (choice === 'organization') {
      console.log('Redirecting to organization signup page...');
      // Replace with your actual navigation logic
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '20px', textAlign: 'center' }}>
        Sign Up As:
      </h1>
      <div
        style={{
          display: 'flex',
          gap: '20px',
        }}
      >
        {/* Individual Signup */}
        <div
          onClick={() => handleSignupChoice('individual')}
          style={{
            cursor: 'pointer',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            backgroundColor: '#fff',
            width: '200px',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        ><Link to={'/individual-signup'}>
          <FaUser size={50} color="#4CAF50" />
          <h3 style={{ fontSize: '20px', marginTop: '10px' }}>Individual</h3>
          <p style={{ color: '#555', fontSize: '14px' }}>Sign up for personal use</p>
          </Link>
        </div>

        {/* Organization Signup */}
        <div
          onClick={() => handleSignupChoice('organization')}
          style={{
            cursor: 'pointer',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            backgroundColor: '#fff',
            width: '200px',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTargetstyle.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        ><Link to={'/individual-signup'}>
          <FaBuilding size={50} color="#2196F3" />
          <h3 style={{ fontSize: '20px', marginTop: '10px' }}>Organization</h3>
          <p style={{ color: '#555', fontSize: '14px' }}>Sign up for business use</p>
          </Link>
        </div>
      </div>
    </div>
  );
};


export default signup