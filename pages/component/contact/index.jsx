import React from 'react';
import { Box, TextField, Button, Typography, useMediaQuery } from '@mui/material';

const ContactForm = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f9f9f9"
      padding={2}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        boxShadow={3}
        borderRadius={2}
        bgcolor="white"
        overflow="hidden"
        width={isMobile ? '120%' : '80%'}
      >
        {/* Right side with the form */}
        <Box flex={1.5} padding={4}>
          <Typography variant="h5" fontWeight="bold" marginBottom={3}>
            Contact Us
          </Typography>
          <form action="https://getform.io/f/arooqxeb" method="POST">
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              required
              name="email"
            />
            <TextField
              label="Phone No"
              variant="outlined"
              fullWidth
              margin="normal"
              type="tel"
              name="phone"
            />
            <TextField
              label="Message"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
              name="message"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 2, backgroundColor: '#1976d2' }}
            >
              Submit
            </Button>
          </form>
        </Box>

        {/* Left side with the image */}
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="white"
          padding={2}
        >
          <img
            src="https://img.freepik.com/free-vector/contact-us-concept-illustration_114360-3147.jpg?semt=ais_hybrid"
            alt="Contact Us"
            style={{
              width: isMobile ? '120%' : '120%',
              height: isMobile ? 'auto' : '80%',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ContactForm;
