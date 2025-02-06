import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Divider,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import Wrapper from "@/layout/wrapper/wrapper";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import toast from "react-hot-toast";

export const ViewDetails = () => {
  const [listing, setListing] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("listing")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setListing(data);
        setValue("title", data.title);
        setValue("description", data.description);
        setValue("price", data.price);

        // Fetch ratings
        const { data: ratingsData } = await supabase
          .from("rating")
          .select("*")
          .eq("listing_id", id);

        setRatings(ratingsData);
        setAverageRating(
          ratingsData.reduce((acc, curr) => acc + curr.rating, 0) /
            ratingsData.length || 0
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, setValue]);

  const handleEdit = () => setOpenEditDialog(true);

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from("listing")
        .update(data)
        .eq("id", listing.id);

      if (error) throw error;

      setListing((prev) => ({ ...prev, ...data }));
      setOpenEditDialog(false);
      toast.success("Listing updated successfully!");
      router.push("/cms/admin/all-listing");
    } catch (err) {
      toast.error("Error updating listing!");
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("listing")
        .delete()
        .eq("id", listing.id);

      if (error) throw error;

      toast.success("Listing deleted successfully!");
      router.push("/cms/admin/all-listing");
    } catch (err) {
      toast.error("Error deleting listing!");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!listing) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="text.secondary">
          Listing not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Wrapper>
      <Box sx={{ display: "flex", justifyContent: "center", padding: "16px" }}>
        <Box
          sx={{
            maxWidth: "1000px",
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            padding: "24px",
          }}
        >
          {/* Listing Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                component="img"
                src={listing.img}
                alt={listing.title}
                sx={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              <Typography variant="h5" fontWeight="bold" mt={2}>
                {listing.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" mt={1}>
                {listing.description}
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold" mt={2}>
                Price: ${listing.price}
              </Typography>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button variant="outlined" color="error" onClick={handleDelete}>
                  Delete
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Reviews Section */}

          <Typography variant="h6" fontWeight="bold">
            Average Rating: <strong>{averageRating.toFixed(1)}</strong>
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Reviews ({ratings.length})
          </Typography>

          {ratings.length > 0 ? (
            ratings.map((review, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="body2" fontWeight="bold">
                  {review.user_email}
                </Typography>
                <Typography variant="body2" fontStyle="italic">
                  {dayjs(review.created_at).format("DD/MM/YYYY")}
                </Typography>
                <Typography variant="body1" mt={1}>
                  {review.review}
                </Typography>
                {/* <Divider sx={{ mt: 1 }} /> */}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No reviews yet.
            </Typography>
          )}
        </Box>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Listing</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Title"
                {...register("title", { required: "Title is required" })}
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={{ mb: 2, mt: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                {...register("description", {
                  required: "Description is required",
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                {...register("price", { required: "Price is required" })}
                error={!!errors.price}
                helperText={errors.price?.message}
                sx={{ mb: 2 }}
              />
              <DialogActions>
                <Button
                  onClick={() => setOpenEditDialog(false)}
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Save
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </Wrapper>
  );
};

export default ViewDetails;
