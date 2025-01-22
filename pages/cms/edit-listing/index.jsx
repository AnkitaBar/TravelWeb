import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { supabase } from '@/lib/supabaseClient';

export const ViewDetails = () => {
  const [listing, setListing] = useState(null);
  const [editListing, setEditListing] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; // Wait for the `id` to be available from the route

      try {
        const { data, error } = await supabase
          .from('listing')
          .select('*')
          .eq('id', id)
          .single(); // Fetch a single product by ID

        if (error) throw error;
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleEdit = () => {
    setEditListing(listing); // Set the current listing in the edit state
    setOpenEditDialog(true); // Open the edit dialog
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('listing')
        .update(editListing)
        .eq('id', listing.id);

      if (error) throw error;

      setListing(editListing); // Update the local state
      setOpenEditDialog(false); // Close the dialog
      router.push('/cms/all-listing'); // Redirect to all listings
    } catch (err) {
      console.error('Error updating listing:', err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('listing')
        .delete()
        .eq('id', listing.id);

      if (error) throw error;

      router.push('/cms/all-listing'); // Redirect after deletion
    } catch (err) {
      console.error('Error deleting listing:', err.message);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!listing) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Listing not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        padding: '16px',
      }}
    >
      <Box
        sx={{
          maxWidth: '800px',
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <Grid container>
          {/* Image Section */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <Box
              component="img"
              src={listing.img}
              alt={listing.title}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
            />
          </Grid>

          {/* Details Section */}
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Title: {listing.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Description: {listing.description}
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
              Price: ${listing.price}
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Listing</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            
            rows={4}
            label="Title"
            value={editListing?.title || ''}
            onChange={(e) =>
              setEditListing({ ...editListing, title: e.target.value })
            }
            sx={{ marginBottom: 2,
            marginTop: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Description"
            value={editListing?.description || ''}
            onChange={(e) =>
              setEditListing({ ...editListing, description: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Price"
            value={editListing?.price || ''}
            onChange={(e) =>
              setEditListing({ ...editListing, price: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewDetails;
