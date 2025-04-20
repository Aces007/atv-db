// components/UserProfile.jsx

"use client"; // Add this line for client component

import React from 'react';
import { Box, Typography, Avatar, Paper, Button } from '@mui/material';

const UserProfile = () => {
  // Static user data
  const user = {
    fullname: "Juan G. Dela Cruz",
    course: "BS Computer Enineering",
    email: "Juan.DelaCruz@gmail.com",
    mobile: "09123456489",
    story: "I am outgoing, dedicated, and open-minded. I get access to people and adjust to changes with ease. I believe that a person should work on developing their professional skills and learning new things all the time. Currently, I am looking for new career opportunities my current job position cannot provide.",
    avatar: "https://via.placeholder.com/100" // Placeholder image
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', // Center the Box
        alignItems: 'flex-start', 
        height: '100vh', // Full viewport height
        backgroundColor: 'var(--background)', // Use your background color
        padding: 'var(--pad-mar-lg)', 
        gap: 4 // Spacing between columns
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 'var(--pad-mar-lg)', 
          textAlign: 'center', 
          borderRadius: 'var(--br-general)', 
          backgroundColor: 'var(--cc-user-basic-bg)', 
          boxShadow: '0px 5px 10px 2px black',
          flex: 1 // Allow this column to grow
        }}
      >
        <Typography 
          variant="h4" // Header style
          sx={{ 
            marginBottom: '20px', 
            fontWeight: 'bold', 
            color: '#ffe100d5'
          }}
        >
          User Profile
        </Typography>
        <Avatar 
          src={user.avatar} 
          alt={user.fullname} 
          sx={{ 
            width: 100, 
            height: 100, 
            borderRadius: '60px',
            margin: '0 auto' // Center the Avatar
          }} 
        />
        <Typography 
          variant="h5" 
          sx={{ 
            marginTop: 'var(--pad-mar-sm)', 
            fontFamily: 'var(--ff-mainTxt)', 
            color: 'var(--cc-txt-color1)', 
            fontWeight: 'bold' // Bold name
          }}
        >
          {user.fullname}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'var(--cc-txt-color1)', 
            marginTop: 'var(--pad-mar-sm)' 
          }}
        >
          {user.course}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'var(--cc-txt-color1)', 
            marginTop: 'var(--pad-mar-sm)' 
          }}
        >
          {user.email}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'var(--cc-txt-color1)', 
            marginTop: 'var(--pad-mar-sm)' 
          }}
        >
          {user.mobile}
        </Typography>
        <Typography 
          variant="body3" 
          sx={{ 
            color: 'var(--cc-txt-color1)', 
            marginTop: 'var(--pad-mar-sm)', 
            opacity: 0.8 
          }}
        >
          About Me: {user.story}
        </Typography>
      </Paper>

      {/* Articles Upload Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1, // Allow this column to grow
          padding: 'var(--pad-mar-lg)', 
          borderRadius: 'var(--br-general)', 
          backgroundColor: 'var(--cc-user-basic-bg)', 
          boxShadow: '0px 5px 10px 2px black' 
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold', 
            marginBottom: '20px' 
          }}
        >
          Articles
        </Typography>
        
      </Paper>
    </Box>
  );
};

export default UserProfile;