import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";

const Home = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/component/about"); // Redirect to /about
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        <Image
          src="/hero2.webp" // Replace with your image path
          alt="Fullpage Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority
        />
      </Box>

      {/* Content Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          left: "5%",
          transform: "translateY(-50%)",
          color: "white",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
          maxWidth: 500,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
            marginBottom: "20px",
            lineHeight: 1.5,
          }}
        >
          "Travel is the only thing you buy that makes you richer."
        </Typography>
        <Button
          variant="contained"
          onClick={handleButtonClick}
          sx={{
            backgroundColor: "#f56b2a", // Base button color
            color: "white",
            padding: { xs: "10px 20px", sm: "20px 30px" },
            fontSize: { xs: "1rem", sm: "1.2rem" },
            borderRadius: "30px",
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#f90404", // Hover color
              transform: "scale(1.05)", // Zoom effect
            },
            "&:active": {
              transform: "scale(0.95)", // Active effect
            },
          }}
        >
          Explore
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
