import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Rating } from '@mui/material';
import Slider from "react-slick";
import { supabase } from '@/lib/supabaseClient';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RatingSlider = () => {
  const [ratings, setRating] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('rating')
        .select('*');

      if (error) {
        console.error('Error fetching ratings:', error);
      } else {
        setRating(data || []);
      }
    };

    fetchReviews();
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: true,
    swipeToSlide: true,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Box sx={{ padding: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" color="error" fontWeight="bold" gutterBottom>
        Customer Reviews
      </Typography>
      <Slider {...sliderSettings}>
        {ratings.length > 0 ? (
          ratings.map((rating, index) => (
            <Box key={index} sx={{ padding: '10px' }}>
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  maxWidth: 320,
                  width: '100%',
                  boxShadow: 3,
                  margin: '0 auto',
                  padding: '1rem',
                }}
              >
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">
                    {rating.comment}
                  </Typography>
                  <Grid container spacing={1} sx={{ marginTop: '10px' }}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Email:</strong> {rating.user_email}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Rating value={rating.rating} precision={0.5} readOnly />
                    
                      <Typography variant="caption" color="textSecondary">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </Typography>

                    
                      <Typography variant="body1" color="textSecondary">
                        <strong>Review:</strong> {rating.review}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No ratings available.
          </Typography>
        )}
      </Slider>
    </Box>
  );
};

export default RatingSlider;
