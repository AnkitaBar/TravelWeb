import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import { Avatar, Container, Grid, Paper, Typography } from '@mui/material';
import styled from '@emotion/styled';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const testimonials = [
  {
    id: 1,
    name: "Kristen Morres",
    title: "XL Director",
    quote: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
    image: "https://webthemez.com/demo/gogym-single-page-bootstrap-4-template/assets/img/ava/img2.jpg",
  },
  {
    id: 2,
    name: "James Vintel",
    title: "VNT Manager",
    quote: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
    image: "https://webthemez.com/demo/gogym-single-page-bootstrap-4-template/assets/img/ava/img2.jpg",
  },
];

// Styled components for the design
const QuoteBox = styled(Paper)({
  position: 'relative',
  padding: '24px',
  paddingBottom: '40px',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  maxWidth: '500px',
  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -15,
    left: '20%',
    borderWidth: '15px',
    borderStyle: 'solid',
    borderColor: '#f9f9f9 transparent transparent transparent',
  },
});

const QuoteIcon = styled(FormatQuoteIcon)({
  color: '#2979ff',
  fontSize: '2rem',
  marginRight: '16px',
});

const AuthorContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginTop: '1rem',
});

export const Testimonial = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <Container style={{ marginTop: '100px', marginBottom: '50px' }}>
      <Grid style={{ marginBottom: '50px' }}>
        <Typography
          variant="h3"
          component="div"
          style={{
            // marginTop: '10px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Testimonials
        </Typography>
        <Typography
          variant="body1"
          component="div"
          style={{
            marginTop: '50px',
            marginBottom: '30px',
            textAlign: 'center',
            fontWeight: 'semibold',
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        </Typography>
      </Grid>
      <Grid container justifyContent="center" spacing={2}>
        {testimonials.map((testimonial, i) => (
          <Grid item xs={12} md={6} sm={12} key={i}>
            <QuoteBox elevation={3}>
              <Typography
                variant="h6"
                component="div"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <QuoteIcon
                  style={{
                    transform: 'scaleX(-1) rotate(0deg)',
                    marginRight: '8px',
                    marginTop: '-80px',
                  }}
                />
                {testimonial.quote}
              </Typography>
            </QuoteBox>
            <AuthorContainer>
              <Avatar
                alt={testimonial.name}
                src={testimonial.image}
                style={{ width: 50, height: 50, marginRight: '8px' }}
              />
              <div>
                <Typography variant="subtitle1" component="div">
                  {testimonial.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {testimonial.title}
                </Typography>
              </div>
            </AuthorContainer>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
