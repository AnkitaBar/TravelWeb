import { useEffect, useState } from "react";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { supabase } from "@/lib/supabaseClient";
import Wrapper from "@/layout/wrapper/wrapper";

const columns = [
  { field: "listing_title", headerName: "Listing Title", width: 200 },
  { field: "user_email", headerName: "User Email", width: 200 },
  { field: "from", headerName: "Check-In", width: 150 },
  { field: "to", headerName: "Check-Out", width: 150 },
  { field: "num_guests", headerName: "Guests", width: 100 },
  { field: "subtotal", headerName: "Subtotal ($)", width: 120 },
  { field: "created_at", headerName: "Created At", width: 180 },
];

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("booking")
        .select("*");

      if (error) {
        throw error;
      }

      // Ensure data integrity
      const formattedData = data.map((booking) => ({
        id: booking.id, // Must have a unique ID
        listing_title: booking.listing_title || "N/A",
        user_email: booking.user_email || "N/A",
        from: booking.from ,
        to: booking.to || "N/A",
        num_guests: booking.num_guests || 0,
        subtotal: booking.subtotal || 0,
        created_at: new Date(booking.created_at).toLocaleString(),
      }));

      setBookings(formattedData);
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
  <Wrapper>

    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "120px",
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
      >
        All Bookings
      </Typography>

      <Card
        sx={{
          width: "100%",
          maxWidth: "1200px",
          p: 2,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={bookings}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "primary.main",
                color: "black",
                fontSize: "16px",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "action.hover",
              },
            }}
          />
        )}
      </Card>
    </Box>
    </Wrapper>
    </>
  );
};

export default BookingsPage;
