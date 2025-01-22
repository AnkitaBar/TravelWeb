// components/Header.js

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import styles from "@/styles/Header.module.css"; // Import the CSS module
import { useAuthStore } from "@/lib/useAuthStore";
import { supabase } from "@/lib/supabaseClient"; // Make sure to import your supabase instance
import { toast } from "react-toastify";

const Header = () => {
  const [open, setOpen] = useState(false); // To toggle the drawer (hamburger menu)
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { userRole, setUserId, setUserRole } = useAuthStore();
  // const { userRole } = useAuthStore(); // Assuming userRole is fetched from your auth store

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user);
    };

    fetchSession();

    // Listen to authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setOpen(false); // Close the drawer after navigation on mobile
  };

  // const handleLogout = async (event) => {
  //   if (event) event.preventDefault(); // Prevent default link behavior
  //   await supabase.auth.signOut(); // Sign out using Supabase
  //   setUser(null); // Update local state
  //   router.push("/"); // Redirect to login page
  // };

  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to logout!');
      return;
    }

    // Clear user-related data
    setUserId(null);
    setUserRole(null);

    // Redirect to login page
    toast.success('Logged out successfully!');
    router.push('/');
  };

  return (
    <AppBar position="sticky" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        {/* Logo Section */}
        <Typography
          variant="h6"
          className={styles.logo}
          onClick={() => handleNavigation("/")}
        >
          Travel Website
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", sm: "flex" } }}>
          <Button color="inherit" onClick={() => handleNavigation("/")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => handleNavigation("/component/about")}>
            About
          </Button>

          {userRole === "admin" ? (
            <Button
              color="inherit"
              onClick={() => handleNavigation("/cms/dashboard")}
            >
             Admin services
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={() => handleNavigation("/cms/all-listing")}
            >
              Services
            </Button>
          )}

          <Button color="inherit" onClick={() => handleNavigation("/component/contact")}>
            Contact
          </Button>

          {/* Conditionally render Login/Logout */}
          {user ? (
            <Button color="inherit" onClick={(event) => handleLogout(event)}>
              Logout
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={() => handleNavigation("/auth/login")}
            >
              Login
            </Button>
          )}
        </Box>

        {/* Mobile Hamburger Menu */}
        <IconButton
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "block", sm: "none" } }}
          onClick={handleToggleDrawer}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Drawer for Mobile */}
      <Drawer anchor="right" open={open} onClose={handleToggleDrawer}>
        <Box sx={{ width: 250 ,marginTop:"80px"}} role="presentation">
          <List>
            <ListItem button onClick={() => handleNavigation("/")}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/component/about")}>
              <ListItemText primary="About" />
            </ListItem>
            {userRole === "admin" ? (
              <ListItem
                button
                onClick={() => handleNavigation("/cms/dashboard")}
              >
                <ListItemText primary="Admin control" />
              </ListItem>
            ) : (
              <ListItem
                button
                onClick={() => handleNavigation("/cms/all-listing")}
              >
                <ListItemText primary="Services" />
              </ListItem>
            )}

            <ListItem button onClick={() => handleNavigation("/component/contact")}>
              <ListItemText primary="Contact" />
            </ListItem>

            {/* Conditionally render Login/Logout */}
            {user ? (
              <ListItem button onClick={(event) => handleLogout(event)}>
                <ListItemText primary="Logout" />
              </ListItem>
            ) : (
              <ListItem button onClick={() => handleNavigation("/auth/login")}>
                <ListItemText primary="Login" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
