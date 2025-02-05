import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemButton,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore, Menu } from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';

const Dashboard = () => {
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggle = (option) => {
    setOpen(open === option ? null : option);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <List sx={{ overflowX: 'hidden' }}>
      {/* Listing Section */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleToggle('Listing')} sx={listItemButtonStyle}>
          <ListItemText primary="Listing" />
          {open === 'Listing' ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open === 'Listing'} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          <ListItem component={Link} href="/cms/admin/all-listing" sx={listItemLinkStyle}>
            <Typography sx={typographyStyle}>All Listing</Typography>
          </ListItem>
          <ListItem component={Link} href="/cms/latest-post" sx={listItemLinkStyle}>
            <Typography sx={typographyStyle}>Latest Post</Typography>
          </ListItem>
          <ListItem component={Link} href="/cms/blog-category" sx={listItemLinkStyle}>
            <Typography sx={typographyStyle}>All Categories</Typography>
          </ListItem>
        </List>
      </Collapse>

      {/* user Section */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleToggle('User')} sx={listItemButtonStyle}>
          <ListItemText primary="User" />
          {open === 'User' ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open === 'User'} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          <ListItem component={Link} href="/cms/admin/all-booking" sx={listItemLinkStyle}>
            <Typography sx={typographyStyle}>All Bookings</Typography>
          </ListItem>
          <ListItem component={Link} href="/cms/user/all-user" sx={listItemLinkStyle}>
            <Typography sx={typographyStyle}>All Users</Typography>
          </ListItem>
          {/* <ListItem component={Link} href="/cms/testimonial" sx={listItemLinkStyle}>
            <Typography sx={typographyStyle}>Testimonial</Typography>
          </ListItem> */}
        </List>
      </Collapse>

      {/* Analysis Section */}
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleToggle('Analysis')} sx={listItemButtonStyle}>
          <ListItemText primary="Analysis" />
          {open === 'Analysis' ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open === 'Analysis'} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          <ListItem component={Link} href="/cms/admin/analysis" sx={listItemLinkStyle}>
            <Typography sx={typographyStyle}>All Analysis</Typography>
          </ListItem>
        </List>
      </Collapse>
    </List>
  );

  return (
    <Box>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ margin: 1 }}
        >
          <Menu />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: isMobile ? '60px' : '74px',
            height: isMobile ? '100vh' : 'calc(100vh - 64px - 220px)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

const listItemButtonStyle = {
  borderRadius: 1,
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateX(10px)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#9c27b0", // Purple hover effect
    color: "white", // White text color for hover effect
  },
};

const listItemLinkStyle = {
  textDecoration: "none",
  color: "#1976d2",
  "&:hover": {
    backgroundColor: "#e8f5e9", // Light hover background for links
  },
};

const typographyStyle = {
  textTransform: "capitalize",
  padding: 1,
  textAlign: "left",
  fontWeight: "bold",
  color: "inherit", // Ensure text color is inheritable from link style
};

export default Dashboard;
