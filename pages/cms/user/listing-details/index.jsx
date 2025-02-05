import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Divider,
  Rating,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";

const ListingDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userEmail, setUserEmail] = useState(null);

const [fromDate, setFromDate] = useState(null);
const [toDate, setToDate] = useState(null);
const [numberOfGuests, setNumberOfGuests] = useState(2);


  useEffect(() => {
    if (id) {
      fetchListingDetails();
    }
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      setUserEmail(data?.user?.email);
      console.log(data?.user?.email);
      console.log(data?.user?.id);
    }
  };

  const fetchListingDetails = async () => {
    setLoading(true);
    const { data: listingData } = await supabase
      .from("listing")
      .select("*")
      .eq("id", id)
      .single();
    setListing(listingData);

    const { data: ratingsData } = await supabase
      .from("rating")
      .select("*")
      .eq("listing_id", id);
    setRatings(ratingsData);
    setAverageRating(
      ratingsData.reduce((acc, curr) => acc + curr.rating, 0) /
        ratingsData.length || 0
    );
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (!userEmail) {
      alert("You must be logged in to submit a review.");
      return;
    }
    if (rating === 0 || !review) {
      alert("Please provide a rating and review.");
      return;
    }

    await supabase
      .from("rating")
      .insert([
        {
          listing_id: id,
          rating,
          review,
          user_email: userEmail,
          created_at: new Date().toISOString(),
        },
      ]);
    alert("Review submitted successfully!");
    setRating(0);
    setReview("");
    fetchListingDetails();
  };


  const handleSubmitBooking = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both 'From' and 'To' dates.");
      return;
    }
  
    const { data, error } = await supabase.from("booking").insert([
      {
        listing_id: id,
        listing_title: listing?.title || "No title",
        from: fromDate,
        to: toDate,
        num_guests: numberOfGuests,
        subtotal: listing?.price || 0,
        user_email: userEmail,
        created_at: new Date().toISOString(),
      },
    ]);
  
    if (error) {
      console.error("Error:", error);
      alert("Error submitting booking: " + error.message);
    } else {
      alert("Booking submitted successfully!");
  
      // Reset fields
      setFromDate(null);
      setToDate(null);
      setNumberOfGuests(2);
  
      // Refresh the page
      router.reload();
    }
  };
  
  

  if (loading)
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

  return (
    <Box
      sx={{
        padding: "3rem",
        marginTop: "4rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: "12px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Title : {listing?.title || "Title not available"}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "1.5rem",
                }}
              >
                <img
                  src={listing?.img || "https://via.placeholder.com/800x400"}
                  alt={listing?.title || "Listing Image"}
                  style={{ width: "100%", height: "auto" }}
                />
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {listing?.description}
              </Typography>

              <Divider sx={{ marginY: "2rem" }} />

              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                  sx={{ color:"orange" }}
                >
                  Rate & Review
                </Typography>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  precision={0.5}
                  size="large"
                />
                <TextField
                  label="Write a review"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  variant="outlined"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{
                    marginTop: "1rem",
                    borderRadius: "8px",
                    backgroundColor: "orange",
                    color: "white",
                  }}
                  onClick={handleSubmitReview}
                >
                  Submit Review
                </Button>

                {ratings.length > 0 && (
                  <Box sx={{ marginTop: "2rem" }}>
                    <Typography variant="h6" fontWeight="bold">
                      Average Rating:{" "}
                      <strong>{averageRating.toFixed(1)}</strong>
                    </Typography>
                    <Rating
                      name="average-rating"
                      value={averageRating}
                      readOnly
                      size="large"
                    />
                  </Box>
                )}

                <Box sx={{ marginTop: "2rem" }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Reviews:
                  </Typography>
                  {ratings.map((review, index) => (
                    <Box
                      key={index}
                      sx={{
                        marginBottom: "1rem",
                        padding: "1rem",
                        borderRadius: "8px",
                      }}
                    >
                      <Rating
                        name={`rating-${index}`}
                        value={review.rating}
                        readOnly
                        size="small"
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        {review.user_email}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        {dayjs(review.created_at).format("DD/MM/YYYY")}
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        {review.review}
                      </Typography>
                      <Divider sx={{ marginTop: "1rem" }} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>


        {/* Right Side: Booking Details */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              paddingTop: "0.75rem",
              paddingBottom: "0.75rem",
              borderRadius: "4px",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 10px 0 #00000019",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CardContent sx={{ width: "100%", textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Booking Details
              </Typography>

              {/* Date Fields */}
              <Box
                sx={{
                  padding: "0.75rem 1.13rem",
                  borderRadius: "3px",
                  textTransform: "capitalize",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#495560",
                  gap: "2.13rem",
                  marginBottom: "1rem",
                }}
              >
                <TextField
                  label="From"
                  value={fromDate}
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Box>

              <Box
                sx={{
                  padding: "0.75rem 1.13rem",
                  borderRadius: "3px",
                  textTransform: "capitalize",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#495560",
                  gap: "2.13rem",
                  marginBottom: "1rem",
                }}
              >
                <TextField
                  label="To"
                  value={toDate}
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Box>

              <Box
                sx={{
                  padding: "0.75rem 1.13rem",
                  borderRadius: "3px",
                  textTransform: "capitalize",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#495560",
                  gap: "2.13rem",
                  marginBottom: "1rem",
                }}
              >
                <TextField
                  label="No. of Guests"
                  value={numberOfGuests}
                  select
                  fullWidth
                  margin="normal"
                  defaultValue={2}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((guest) => (
                    <MenuItem key={guest} value={guest}>
                      {guest} {guest === 1 ? "guest" : "guests"}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#7bbcb0"
                sx={{ marginY: "1rem" }}
              >
                Subtotal: ${listing?.price || "N/A"}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  marginTop: "1rem",
                  margin: "1rem",
                  borderRadius: "8px",
                  backgroundColor: "#7bbcb0",
                  color: "white",
                  width: "80%",
                  height: "40px",
                  "&:hover": { backgroundColor: "#65a39c" },
                }}
                 onClick={handleSubmitBooking}
              >
                Confirm Booking
              </Button>
              {/* <Button
        variant="outlined"
        fullWidth
        sx={{ marginTop: '1rem', borderRadius: '8px' }}
      >
        Save to Wishlist
      </Button> */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ListingDetails;
