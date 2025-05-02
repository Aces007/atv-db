// components/UserProfile.jsx

"use client";

import React from 'react';
import './UserProfile.css'; // Optional: external CSS if needed

const UserProfile = () => {
  const user = {
    fullname: "Juan G. Dela Cruz",
    course: "BS Computer Engineering",
    email: "Juan.DelaCruz@gmail.com",
    mobile: "09123456789",
    avatar: "\avatar.png"   };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: '100vh',
      backgroundColor: 'var(--background)',
      padding: 'var(--pad-mar-lg)',
      gap: '2rem',
      flexWrap: 'wrap'
    }}>
      <div style={{
        padding: 'var(--pad-mar-lg)',
        textAlign: 'center',
        borderRadius: 'var(--br-general)',
        backgroundColor: 'var(--cc-user-basic-bg)',
        boxShadow: '0px 5px 10px 2px black',
        flex: 1,
        minWidth: '300px'
      }}>
        <h1 style={{
          marginBottom: '20px',
          fontWeight: 'bold',
          color: '#ffe100d5'
        }}>
          User Profile
        </h1>
        <img 
          src={user.avatar} 
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '60px',
            margin: '0 auto',
            display: 'block'
          }}
        />
        <h2 style={{
          marginTop: '1rem',
          fontFamily: 'var(--ff-mainTxt)',
          color: 'var(--cc-txt-color1)',
          fontWeight: 'bold'
        }}>
          {user.fullname}
        </h2>
        <p style={{ color: 'var(--cc-txt-color1)', marginTop: '0.5rem' }}>{user.course}</p>
        <p style={{ color: 'var(--cc-txt-color1)', marginTop: '0.5rem' }}>{user.email}</p>
        <p style={{ color: 'var(--cc-txt-color1)', marginTop: '0.5rem' }}>{user.mobile}</p>
        <p style={{
          color: 'var(--cc-txt-color1)',
          marginTop: '0.5rem',
          opacity: 0.8
        }}>
          <strong>About Me:</strong> {user.story}
        </p>
      </div>

      <div style={{
        padding: 'var(--pad-mar-lg)',
        borderRadius: 'var(--br-general)',
        backgroundColor: 'var(--cc-user-basic-bg)',
        boxShadow: '0px 5px 10px 2px black',
        flex: 1,
        minWidth: '300px'
      }}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Articles</h2>
        {/* You can add article upload features here */}
      </div>
    </div>
  );
};

export default UserProfile;
