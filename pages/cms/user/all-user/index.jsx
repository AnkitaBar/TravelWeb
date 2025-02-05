import { useState, useEffect } from "react";
import { Box, Card, CircularProgress, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { supabase } from "@/lib/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import Wrapper from "@/layout/wrapper/wrapper";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editListing, setEditListing] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("users") // Replace with your table name
          .select("*");

        if (error) {
          throw error;
        }

        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);
  
      if (error) {
        throw error;
      }
  
      // Filter users safely before updating state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error.message);
      toast.error("Error deleting user. Please try again.");
    }
  };
  

  const handleEdit = (user) => {
    setEditListing(user); // Set the user data to be edited
    setOpenEditDialog(true); // Open the edit dialog
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: editListing.name,
          email: editListing.email,
          role: editListing.role,
        })
        .eq("id", editListing.id);

      if (error) {
        throw error;
      }

      // Update the local state with the modified user data
      setUsers(users.map((user) => (user.id === editListing.id ? editListing : user)));
      setOpenEditDialog(false); // Close the dialog
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error.message);
      toast.error("Error updating user. Please try again.");
    }
  };

  return (
    <>
    <Wrapper>

    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "2rem",
          color: "text.primary",
        }}
      >
        All Users
      </Typography>

      <Card
        sx={{
          width: "100%",
          maxWidth: "1200px",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "center",
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
          <Box sx={{ width: "100%" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Role</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell align="center">{user.name}</TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">{user.role}</TableCell>
                    <TableCell align="center">
                      {/* <IconButton color="primary" onClick={() => handleEdit(user)}>
                        <EditIcon />
                      </IconButton> */}
                      <IconButton color="error" onClick={() => handleDelete(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Card>

      {/* Edit Dialog */}
      {/* <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={editListing?.name || ""}
            onChange={(e) =>
              setEditListing({ ...editListing, name: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={editListing?.email || ""}
            onChange={(e) =>
              setEditListing({ ...editListing, email: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Role"
            value={editListing?.role || ""}
            onChange={(e) =>
              setEditListing({ ...editListing, role: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* ToastContainer for notifications */}
      <ToastContainer />
    </Box>
    </Wrapper>
    </>
  );
};

export default UserDetails;
