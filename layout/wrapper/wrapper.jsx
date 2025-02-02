import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Dashboard from '@/pages/cms/admin/dashboard';

const Wrapper = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile view detection

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar (Dashboard) */}
      <Box
        sx={{
          width: isMobile ? '100%' : '240px',
          backgroundColor: '#f4f4f4',
        //   padding: '16px',
          position: 'fixed',
        //   height: '100vh',
          top: 0, // Keep the sidebar at the top
          left: 0, // Align sidebar to the left
          zIndex: 1000, // Ensure it stays on top of other elements
        }}
      >
        <Dashboard sx={{ fontSize: 50 }} />
        {/* Add more sidebar content, e.g., navigation links */}
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          marginLeft: isMobile ? 0 : '240px', // Adjust for sidebar width on desktop
          padding: '16px',
          flex: 1,
          overflowY: 'auto',
          marginTop: '64px', // Adjust for navbar if you have one
        }}
      >
        {children} {/* This renders the page content like AllListing */}
      </Box>
    </Box>
  );
};

export default Wrapper;
