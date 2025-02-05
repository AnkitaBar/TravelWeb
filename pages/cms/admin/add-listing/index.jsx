import { useState } from "react";
import {
  Card,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";
import Wrapper from "@/layout/wrapper/wrapper";

const Listing = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState(null);

  const file = watch("file");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validImageTypes.includes(selectedFile.type)) {
        toast.error("Only image files (JPG, PNG, GIF, WEBP) are allowed!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      setValue("file", selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (data) => {
    if (!data.file) {
      toast.error("Please upload an image.", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      const filePath = `listing-images/${Date.now()}_${data.file.name}`;
      const { error: storageError } = await supabase.storage.from("mystore").upload(filePath, data.file);
      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage.from("mystore").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("listing").insert([
        {
          title: data.title,
          description: data.description,
          img: publicUrlData.publicUrl,
          price: data.price,
        },
      ]);

      if (dbError) throw dbError;

      toast.success("Listing added successfully!", { position: "top-right", autoClose: 3000 });
      router.push("/cms/admin/all-listing");
    } catch (error) {
      toast.error(`Error: ${error.message}`, { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <>
    <Wrapper>
    <Box p={isMobile ? 2 : 4} sx={{ marginTop: "100px" }}>
     
      <Typography variant="h4" gutterBottom textAlign="center">
        Add a New Listing
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Title"
                  {...register("title", { required: "Title is required" })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Description"
                  {...register("description", { required: "Description is required" })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  multiline
                  rows={4}
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 1, message: "Price must be at least $1" },
                  })}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle1">Upload Image:</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px dashed #ddd",
                    padding: "8px",
                    borderRadius: "8px",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      borderRadius: "8px",
                      padding: "6px 16px",
                      marginRight: "10px",
                    }}
                  >
                    Choose File
                    <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                  </Button>

                  {preview && (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Card sx={{ width: 80, height: 80, overflow: "hidden" }}>
                        <CardMedia
                          component="img"
                          height="100%"
                          image={preview}
                          alt="Preview"
                          sx={{ objectFit: "cover" }}
                        />
                      </Card>
                      <Typography variant="caption" mt={1}>{file?.name}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box textAlign="center">
                <Button variant="contained" color="primary" type="submit" fullWidth={isMobile}  >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <ToastContainer />
    </Box>
    </Wrapper>
    </>
  );
};

export default Listing;
