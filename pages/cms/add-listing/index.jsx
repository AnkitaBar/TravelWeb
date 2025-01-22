import { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const Listing = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !file) {
      alert('Please fill out all fields and upload an image.');
      return;
    }

    try {
      // Upload image to Supabase Storage
      const filePath = `listing-images/${Date.now()}_${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('mystore')
        .upload(filePath, file);

      if (storageError) throw storageError;

      // Get public URL for the image
      const { data: publicUrlData } = supabase.storage
        .from('mystore')
        .getPublicUrl(filePath);

      // Insert data into Supabase table
      const { data: dbData, error: dbError } = await supabase.from('listing').insert([
        {
          title: formData.title,
          description: formData.description,
          img: publicUrlData.publicUrl,
          price: formData.price,
        },
      ]);

      if (dbError) throw dbError;

      alert('Listing added successfully!');
      setFormData({ title: '', description: '', price: '' });
      setFile(null);
      setPreview(null);
      router.push('/cms/all-listing');
    } catch (error) {
      console.error('Error adding listing:', error.message);
    }
  };

  return (
    <Box p={isMobile ? 2 : 4} sx={{ marginTop: '100px' }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Add a New Listing
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  type="number"
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle1">Upload Image:</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px dashed #ddd',
                    padding: '8px',
                    borderRadius: '8px',
                    marginTop: '10px',
                  }}
                >
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      borderRadius: '8px',
                      padding: '6px 16px',
                      marginRight: '10px',
                    }}
                  >
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      hidden
                    />
                  </Button>

                  {preview && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Card sx={{ width: 80, height: 80, overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          height="100%"
                          image={preview}
                          alt="Preview"
                          sx={{ objectFit: 'cover' }}
                        />
                      </Card>
                      <Typography variant="caption" mt={1}>
                        {file.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box textAlign="center">
                <Button variant="contained" color="primary" type="submit" fullWidth={isMobile}>
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Listing;
