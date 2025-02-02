

import { supabase } from "@/lib/supabaseClient";
import { Box, Grid, Typography, Card, CardContent, CardMedia, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/lib/useAuthStore";
import Wrapper from "@/layout/wrapper/wrapper";

const AllListing = () => {
  const [listings, setListings] = useState([]);
  const [view, setView] = useState("card");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editListing, setEditListing] = useState(null);
  const { userRole } = useAuthStore();
  const router = useRouter();

  const toggleView = () => {
    setView(view === "card" ? "table" : "card");
  };

  const fetchListings = async () => {
    const { data, error } = await supabase.from("listing").select("*");
    if (error) console.error("Error fetching listings:", error.message);
    else setListings(data);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleEdit = (id) => {
    const listingToEdit = listings.find((listing) => listing.id === id);
    setEditListing(listingToEdit);
    setOpenEditDialog(true);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("listing").delete().match({ id });
    if (error) console.error("Error deleting listing:", error.message);
    else fetchListings(); // Refresh the listings after delete
  };

  const handleSaveEdit = async () => {
    const { id, title, description, price, img } = editListing;
    const { error } = await supabase
      .from("listing")
      .update({ title, description, price, img })
      .match({ id });

    if (error) console.error("Error updating listing:", error.message);
    else {
      setOpenEditDialog(false);
      fetchListings(); // Refresh the listings after update
    }
  };

  return (
    <>
    <Wrapper>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        padding: 10,
        overflow:'hidden'
      }}
    >
      <Button variant="contained" onClick={toggleView} sx={{ marginBottom: 3 }}>
        Toggle {view === "card" ? "Table View" : "Card View"}
      </Button>

      <Typography variant="h5" gutterBottom>
        Listings
      </Typography>

      {view === "card" ? (
        // Card View
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid item xs={12} sm={6} md={3} key={listing.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 5,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={listing.img}
                  alt={listing.title}
                  sx={{
                    borderRadius: "8px",
                    width: "100%",
                    height: 200,
                    display: "block",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Title : {listing.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Description : {listing.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    Price : ${listing.price}
                  </Typography>

                  {/* / role base selection / */}

                  {userRole === "admin" ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{ marginTop: 2 }}
                      onClick={() =>
                        router.push(`/cms/admin/edit-listing?id=${listing.id}`)
                      }
                    >
                      View More
                    </Button>
                  ) :
                   userRole === "user" ? (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ marginTop: 2 }}
                      onClick={() =>
                        router.push(`/cms/user/book-listing?id=${listing.id}`)
                      }
                    >
                      Book Now
                    </Button>
                  ):(
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  onClick={() => router.push(`/auth/login`)}
                >
                  Login to Continue
                </Button>
          )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Table View
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                {userRole === "admin" && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <img
                      src={listing.img}
                      alt={listing.title}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell>{listing.title}</TableCell>
                  <TableCell>{listing.description}</TableCell>
                  <TableCell>${listing.price}</TableCell>
                  {userRole === "admin" && (
                    <TableCell>
                      <IconButton onClick={() => handleEdit(listing.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(listing.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* {/ {/ Edit Dialog /} /} */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
      >
        <DialogTitle>Edit Listing</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editListing?.title || ""}
            onChange={(e) =>
              setEditListing({ ...editListing, title: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={editListing?.description || ""}
            onChange={(e) =>
              setEditListing({ ...editListing, description: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Price"
            value={editListing?.price || ""}
            onChange={(e) =>
              setEditListing({ ...editListing, price: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEditDialog(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Wrapper>
    </>
  );
};

export default AllListing;