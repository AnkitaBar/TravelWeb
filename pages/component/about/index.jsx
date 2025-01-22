import React from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ContentPasteOffIcon from "@mui/icons-material/ContentPasteOff";
import HomeIcon from '@mui/icons-material/Home';
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import AirIcon from '@mui/icons-material/Air';
import WifiIcon from '@mui/icons-material/Wifi';
import BathtubIcon from '@mui/icons-material/Bathtub';
import DownhillSkiingIcon from '@mui/icons-material/DownhillSkiing';
const Services = () => {
  const services = [
    {
      id: 1,
      title: "World class Tour",
      description:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
      icon: DownhillSkiingIcon,
    },
    {
      id: 2,
      title: "Best Tour Guide",
      description:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
      icon: MobileFriendlyIcon,
    },
    {
      id: 3,
      title: "Good Home Stay",
      description:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
      icon: HomeIcon,
    },
    {
      id: 4,
      title: "Steam Bath",
      description:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
      icon: BathtubIcon,
    },
    {
      id: 5,
      title: "Wi-Fi",
      description:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
      icon: WifiIcon ,
    },
    {
      id: 6,
      title: "Air Conditioning",
      description:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
      icon: AirIcon,
    },
  ];

  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container sx={{ marginTop: "80px", marginBottom: "80px" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mt={2}
        sx={{ textAlign: "center" }}
      >
        Our Services
      </Typography>
      <Grid
        container
        spacing={4}
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {services.map((service) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={service.id}
            data-aos="fade-zoom-in"
            data-aos-easing="ease-in-out-sine"
            data-aos-duration="800"
            data-aos-delay="300"
            data-aos-offset="100"
            data-aos-anchor-placement="center-bottom"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: isMobile ? "column" : "row",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: darkMode ? "#e0e0e0" : "#fff",
                maxWidth: "500px",
                margin: "auto",
                "&:hover": {
                  boxShadow: darkMode
                    ? "0px 8px 20px rgba(255, 255, 255, 0.2)"
                    : "0px 8px 20px rgba(0, 0, 0, 0.3)",
                },
                transition: "box-shadow 0.3s ease",
              }}
            >
              <service.icon
                style={{
                  fontSize: "3rem",
                  color: darkMode ? "#798189" : "#efb624",
                  marginRight: isMobile ? "0" : "1rem",
                  marginBottom: isMobile ? "1rem" : "0",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="semibold"
                  sx={{ fontSize: "1.5rem" }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: "1rem" }}
                >
                  {service.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services;
