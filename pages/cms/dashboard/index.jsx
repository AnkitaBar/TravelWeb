import {  FaUser, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import { IoIosAddCircle } from "react-icons/io";
import Link from 'next/link';
import { Box, Grid } from '@mui/material';

export const IconLinksPage = () => {
  const links = [
    { href: '/cms/add-listing', icon: <IoIosAddCircle />, label: 'Add Listing' },
    { href: '/cms/all-listing', icon: <FaChartBar />, label: 'All Listing' },
    { href: '/cms/all-booking', icon: <FaCalendarAlt />, label: 'Booking' },
    { href: '/cms/user/details', icon: <FaUser />, label: 'User' },
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Grid container spacing={4} justifyContent="center" maxWidth="500px">
        {links.map((link) => (
          <Grid
            item
            key={link.href}
            xs={6} // 2 icons per row
            sx={{ textAlign: 'center' }}
          >
            <Link href={link.href} passHref legacyBehavior>
              <a style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '110%',
                    borderRadius: '8px', // Rounded corners for a square box
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                      transform: 'scale(1.05)', // Subtle zoom on hover
                      transition: '0.3s',
                    },
                    cursor: 'pointer',
                  }}
                  title={link.label}
                >
                  <Box sx={{ fontSize: '6rem', color: '#333' }}>{link.icon}</Box>
                  <Box sx={{ mt: 1, fontSize: '1rem', color: '#666' }}>{link.label}</Box>
                </Box>
              </a>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default IconLinksPage;
