import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import Slider from "react-slick";
import { supabase } from '@/lib/supabaseClient';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuthStore } from '@/lib/useAuthStore';

const ListingSlider = () => {
  const [listings, setListings] = useState([]);
  const router = useRouter();
   const { userRole } = useAuthStore();

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase.from('listing').select('*');

      if (error) {
        console.error('Error fetching listings:', error);
      } else {
        setListings(data || []);
      }
    };

    fetchListings();
  }, []);

  const handleExploreClick = (id) => {
    // Conditionally navigate based on the user's role
    if (userRole === 'admin') {
      router.push(`/cms/admin/edit-listing?id=${id}`);
    } else {
      router.push(`/cms/user/listing-details?id=${id}`);
    }
  };

  // Slider settings for autoplay and spacing
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
      Trending Treks
      </Typography>
      <Slider {...sliderSettings}>
        {listings.map((listing) => (
          <Box key={listing.id} sx={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
            <Card
              sx={{
                position: 'relative', // This makes the Card positionable
                borderRadius: 2,
                overflow: 'hidden',
                maxWidth: 350, // Adjusted width
                width: '100%',
                boxShadow: 3,
                margin: '0 auto', // Center the cards
              }}
            >
              {/* Image */}
              <CardMedia
                component="img"
                sx={{ width: '100%', height: '300px', objectFit: 'cover' }}
                image={listing.img}
                alt={listing.title}
              />

              {/* Content inside image (Positioned left corner) */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark background for better text visibility
                  padding: ' 10px ',
                  borderRadius: '5px',
               
                  width: '80%', // Adjusted width
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {listing.title}
                </Typography>
                {/* <Typography variant="h6" fontWeight="bold">
                 ${listing.price}
                </Typography> */}
                <Button
                  variant="contained"
                  color="white"
                  onClick={() => handleExploreClick(listing.id)}
                  sx={{ marginTop: 1 , borderRadius: '20px ', border: '2px solid red', color: 'white',
                  "&:hover": { backgroundColor: "white", color: "black" },
                  }}
                >
                  Explore
                </Button>
              </Box>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ListingSlider;
