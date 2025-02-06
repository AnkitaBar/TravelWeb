// pages/_app.js

import Header from "../layout/header";
import { Box } from "@mui/material";
import "@/styles/globals.css";
import Footer from '../layout/footer';
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";



function MyApp({ Component, pageProps }) {
  return (
    <>
    <Header/>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Ensures full height of the page
      }}
    >
 <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "1.2rem",
            fontWeight: "bold",
            padding: "16px",
            borderRadius: "10px",
          },
        }}
      />
            <Component {...pageProps} />
      
      <Footer/> 
    </Box>
    </>
  );
}

export default MyApp;
