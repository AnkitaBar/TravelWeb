// pages/_app.js

import Header from "../layout/header";
import { Box } from "@mui/material";
import "@/styles/globals.css";
import Footer from '../layout/footer';

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
      <Component {...pageProps} />
      
      <Footer/> 
    </Box>
    </>
  );
}

export default MyApp;
