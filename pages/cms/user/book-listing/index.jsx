import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';

import { supabase } from '@/lib/supabaseClient';

const RoomBookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    checkIn: '',
    checkOut: '',
    adults: 0,
    kids: 0,
    specialRequest: '',
    listingTitle: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data, error } = await supabase.from('booking').insert([formData]);
      if (error) {
        console.error('Error inserting data:', error.message);
        alert('Failed to book the room.');
      } else {
        console.log('Data inserted:', data);
        alert('Room booked successfully!');
      }
    } catch (error) {
      console.error('Unexpected error:', error.message);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'white',
        marginTop: '120px',
        marginBottom: '100px',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Room Booking
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in mi libero.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Listing Title"
            name="listingTitle"
            value={formData.listingTitle}
            onChange={handleChange}
            placeholder="E.g. John"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="E.g. Sina"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="E.g. +1 234 567 8900"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E.g. email@example.com"
            type="email"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Check-In"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Check-Out"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Adults"
            name="adults"
            value={formData.adults}
            onChange={handleChange}
            variant="outlined"
          >
            {[...Array(6).keys()].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Kids"
            name="kids"
            value={formData.kids}
            onChange={handleChange}
            variant="outlined"
          >
            {[...Array(6).keys()].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Special Request"
            name="specialRequest"
            value={formData.specialRequest}
            onChange={handleChange}
            placeholder="E.g. Special Request"
            variant="outlined"
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            sx={{ borderRadius: 5 }}
          >
            Book Now
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoomBookingForm;
