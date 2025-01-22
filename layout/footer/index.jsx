// components/Footer.js
import React from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "rgb(246, 248, 249)", // Transparent background
        color: "black",
        padding: "20px",
        marginTop: "auto", // Ensures footer stays at the bottom
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)", // Subtle border shadow
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center", // Centers content in smaller screens
        }}
      >
        {/* Column 1 - Logo & Info */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Travel Website
          </Typography>
          
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            © 2025 MyApp. All Rights Reserved.
          </Typography>
        </Grid>

        {/* Column 2 - Social Media Links */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Follow Us
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              color="inherit"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              color="inherit"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              <Instagram />
            </IconButton>
            <IconButton
              color="inherit"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              <LinkedIn />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
