import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Fab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/lib/useAuthStore";
import Wrapper from "@/layout/wrapper/wrapper";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { toast, ToastContainer } from "react-toastify";
import { useForm, Controller } from "react-hook-form";

const AllListing = () => {
  const [listings, setListings] = useState([]);
  const [view, setView] = useState("card");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editListing, setEditListing] = useState(null);
  const { userRole } = useAuthStore();
  const router = useRouter();

  const { control, handleSubmit, formState: { errors }, setValue } = useForm();

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
    setValue("title", listingToEdit.title);
    setValue("description", listingToEdit.description);
    setValue("price", listingToEdit.price);
    setOpenEditDialog(true);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("listing").delete().match({ id });
  
    if (error) {
      console.error("Error deleting listing:", error.message);
      toast.error("Failed to delete listing!", { position: "top-right", autoClose: 3000 });
    } else {
      toast.success("Listing deleted successfully!", { position: "top-right", autoClose: 3000 });
      fetchListings(); // Refresh the listings after delete
    }
  };

  const handleSaveEdit = async (data) => {
    const { id } = editListing;
    const { error } = await supabase
      .from("listing")
      .update({ title: data.title, description: data.description, price: data.price })
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
            minHeight: "80vh",
            padding: 10,
            overflow: "hidden",
          }}
        >
          <Fab
            color="primary"
            sx={{
              position: "fixed",
              top: 100,
              right: 50,
              borderRadius: "50%",
              boxShadow: 3,
              display: "flex",
            }}
            component={Link}
            href="/cms/admin/add-listing"
          >
            <AddIcon />
          </Fab>

          <Button
            variant="contained"
            onClick={toggleView}
            sx={{ marginBottom: 2 }}
          >
            Toggle {view === "card" ? "Table View" : "Card View"}
          </Button>

          <Typography variant="h5" gutterBottom>
            Listings
          </Typography>

          {view === "card" ? (
            // Card View
            <Grid container spacing={3}>
              {listings.map((listing) => (
                <Grid item xs={12} sm={3} md={4} key={listing.id}>
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
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        paragraph
                      >
                        Description : {listing.description}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        Price : ${listing.price}
                      </Typography>

                      {/* / role base selection / */}

                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                        onClick={() =>
                          router.push(
                            `/cms/admin/edit-listing?id=${listing.id}`
                          )
                        }
                      >
                        View More
                      </Button>
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

          {/* Edit Dialog */}
          <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
            <DialogTitle>Edit Listing</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit(handleSaveEdit)}>
                <Controller
                  name="title"
                  control={control}
                  defaultValue={editListing?.title || ""}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Title"
                      {...field}
                      error={!!errors.title}
                      helperText={errors.title ? "Title is required" : ""}
                      sx={{ marginBottom: 2 }}
                    />
                  )}
                  rules={{ required: "Title is required" }}
                />
                <Controller
                  name="description"
                  control={control}
                  defaultValue={editListing?.description || ""}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Description"
                      {...field}
                      error={!!errors.description}
                      helperText={errors.description ? "Description is required" : ""}
                      sx={{ marginBottom: 2 }}
                    />
                  )}
                  rules={{ required: "Description is required" }}
                />
                <Controller
                  name="price"
                  control={control}
                  defaultValue={editListing?.price || ""}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      type="number"
                      label="Price"
                      {...field}
                      error={!!errors.price}
                      helperText={errors.price ? "Price is required" : ""}
                      sx={{ marginBottom: 2 }}
                    />
                  )}
                  rules={{ required: "Price is required" }}
                />
                <DialogActions>
                  <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Save
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

          <ToastContainer />
        </Box>
      </Wrapper>
    </>
  );
};

export default AllListing;
