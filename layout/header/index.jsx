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
import { supabase } from "@/lib/supabaseClient"; // Import Supabase instance
import { toast } from "react-toastify";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState(false); // ✅ Prevent SSR mismatch
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { userRole, setUserId, setUserRole, fetchUserRole, clearAuth } = useAuthStore();

  useEffect(() => {
    setClient(true); // ✅ Ensures hydration works correctly

    const loadRoleFromStorage = () => {
      const storedRole = localStorage.getItem("userRole");
      if (storedRole) {
        setUserRole(storedRole); // Restore role from localStorage
      }
    };

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        setUserId(session.user.id);

        if (!localStorage.getItem("userRole")) {
          await fetchUserRole(session.user.id); // Fetch from DB only if missing
        }
      }
    };

    loadRoleFromStorage();
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          clearAuth();
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [setUserRole, setUserId, fetchUserRole, clearAuth]);

  const handleLogout = async () => {
    console.log("Logging out...");

    // Supabase logout
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
      toast.error("Failed to logout!");
      return;
    }

    // Clear role from localStorage
    console.log("Clearing role from localStorage...");
    localStorage.removeItem("userRole");

    // Clear user data from global store
    console.log("Clearing user data...");
    setUserRole(null);
    setUser(null);
    setUserId(null);

    // Optional: Check if the user is logged out successfully
    const { data: session } = await supabase.auth.getSession();
    console.log("Session after logout:", session);

    toast.success("Logged out successfully!");
    router.push("/"); // Redirect to homepage or login page
  };

  const handleToggleDrawer = () => {
    setOpen((prev) => !prev); // Toggle the state for the drawer
  };

  const handleNavigation = (path) => {
    router.push(path);
    setOpen(false); // Close the drawer after navigation on mobile
  };

  // console.log("User Role:", userRole);

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

          {/* ✅ Prevent SSR Mismatch by rendering only after hydration */}
          {client && (
            <>
              {userRole === "admin" ? (
                <Button color="inherit" onClick={() => handleNavigation("/cms/admin/dashboard")}>
                  Admin Services
                </Button>
              ) : userRole === "user" ? (
                <Button color="inherit" onClick={() => handleNavigation("/cms/user/user-listing")}>
                  Services
                </Button>
              ) : null}
            </>
          )}

          <Button color="inherit" onClick={() => handleNavigation("/component/contact")}>
            Contact
          </Button>

          {/* Conditionally render Login/Logout */}
          {client && (
            user ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" onClick={() => handleNavigation("/auth/login")}>
                Login
              </Button>
            )
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
        <Box sx={{ width: 250, marginTop: "80px" }} role="presentation">
          <List>
            <ListItem button onClick={() => handleNavigation("/")}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation("/component/about")}>
              <ListItemText primary="About" />
            </ListItem>

            {/* ✅ Prevent SSR Mismatch by wrapping in `client` state */}
            {client && (
              <>
                {userRole === "admin" ? (
                  <ListItem button onClick={() => handleNavigation("/cms/dashboard")}>
                    <ListItemText primary="Admin Services" />
                  </ListItem>
                ) : userRole === "user" ? (
                  <ListItem button onClick={() => handleNavigation("/cms/all-listing")}>
                    <ListItemText primary="Services" />
                  </ListItem>
                ) : null}
              </>
            )}

            <ListItem button onClick={() => handleNavigation("/component/contact")}>
              <ListItemText primary="Contact" />
            </ListItem>

            {/* Conditionally render Login/Logout */}
            {client && (
              user ? (
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              ) : (
                <ListItem button onClick={() => handleNavigation("/auth/login")}>
                  <ListItemText primary="Login" />
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
