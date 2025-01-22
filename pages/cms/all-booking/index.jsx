import { useEffect, useState } from "react";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { supabase } from "@/lib/supabaseClient";

const columns = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "mobile", headerName: "Mobile", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "checkIn", headerName: "Check-In", width: 150 },
  { field: "checkOut", headerName: "Check-Out", width: 150 },
  { field: "adults", headerName: "Adults", width: 100 },
  { field: "kids", headerName: "Kids", width: 100 },
  { field: "specialRequest", headerName: "Special Request", width: 200 },
  { field: "listingTitle", headerName: "Listing Title", width: 200 },
];

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("booking") // Replace with your table name
          .select("*"); // Select all fields

        if (error) {
          throw error;
        }

        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
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
            rows={bookings.map((booking) => ({
              id: booking.id, // Ensure the "id" field exists in your table
              name: booking.name,
              mobile: booking.mobile,
              email: booking.email,
              checkIn: booking.checkIn,
              checkOut: booking.checkOut,
              adults: booking.adults,
              kids: booking.kids,
              specialRequest: booking.specialRequest,
              listingTitle: booking.listingTitle,
            }))}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 3 }, // Show at least 3 rows
              },
            }}
            pageSizeOptions={[3, 5, 10]} // Options for page size selection
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
  );
};

export default BookingsPage;
