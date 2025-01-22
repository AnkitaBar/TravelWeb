import React, { useState, useEffect } from 'react';
import { Container, Grid, Button, Box, Card, CardMedia, CardActionArea, Modal } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';

const projects = [
  { id: 1, name: "Top Place 1", category: "Top Place", image: "/background.jpg" },
  { id: 2, name: "Trek 1", category: "Trek", image: "/treck1.jpg" },
  { id: 3, name: "Top Place 2", category: "Top Place", image: "/treck2.jpg" },
  { id: 4, name: "Top Place 2", category: "Top Place", image: "/background1.webp" },
  { id: 5, name: "Trek 2", category: "Trek", image: "/treck3.jpg" },
  { id: 6, name: "Trek 2", category: "Trek", image: "/treck5.jpg" },
  { id: 7, name: "Trek 2", category: "Trek", image: "/treck6.jpg" },
  { id: 8, name: "Top Place 3", category: "Top Place", image: "treck4.jpg" },
];

const Portfolio = () => {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === category));
    }
  };

  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const styles = {
    mainDiv: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'white',
      marginBottom: '1rem',
      marginTop: '1rem',
    },
    portfolioContainer: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    filterButtons: {
      marginBottom: '2rem',
    },
    hoverEffect: {
      transition: 'transform 0.3s',
    },
    hoverEffectActive: {
      transform: 'scale(1.05)',
    },
  };

  return (
    <div style={styles.mainDiv}>
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <div style={styles.portfolioContainer}>
          <h1>Portfolio</h1>
          <p>Explore the best top places and treks. Discover your next adventure.</p>
        </div>

        <div style={styles.filterButtons}>
          <Box display="flex" justifyContent="center" mb={4}>
            <Button
              variant={selectedCategory === 'All' ? 'contained' : 'outlined'}
              onClick={() => handleFilterChange('All')}
              sx={{ margin: 1 }}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === 'Top Place' ? 'contained' : 'outlined'}
              onClick={() => handleFilterChange('Top Place')}
              sx={{ margin: 1 }}
            >
              Top Place
            </Button>
            <Button
              variant={selectedCategory === 'Trek' ? 'contained' : 'outlined'}
              onClick={() => handleFilterChange('Trek')}
              sx={{ margin: 1 }}
            >
              Trek
            </Button>
          </Box>
        </div>

        <Grid container spacing={4}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={3} key={project.id}>
              <Card data-aos="fade-up">
                <CardActionArea
                  onClick={() => handleOpen(project.image)}
                  style={styles.hoverEffect}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <CardMedia
                    component="img"
                    sx={{ height: 280, objectFit: 'cover' }}
                    image={project.image}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Modal
          open={open}
          onClose={handleClose}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box sx={{ outline: 'none' }}>
            <img
              src={selectedImage}
              alt="Selected Project"
              style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px' }}
            />
          </Box>
        </Modal>
      </Container>
    </div>
  );
};

export default Portfolio;
