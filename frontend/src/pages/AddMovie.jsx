import { useState } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  MenuItem,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const AddMovie = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    releaseDate: '',
    duration: '',
    director: '',
    genre: '',
    cast: '',
    poster: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  
  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)

//   try {
//     const movieData = {
//       ...formData,
//       rating: parseFloat(formData.rating),
//       duration: parseInt(formData.duration),
//       genre: formData.genre ? formData.genre.split(',').map(g => g.trim()) : [],
//       cast: formData.cast ? formData.cast.split(',').map(c => c.trim()) : [],
//     }
//     // Fix poster URL format
// if (movieData.poster && !movieData.poster.startsWith("http")) {
//   movieData.poster = "https://" + movieData.poster;
// }


//     const response = await axios.post('/api/movies', movieData, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     });

//     console.log("MOVIE ADDED:", response.data);
//     localStorage.setItem("movieSuccess", "Movie added successfully!");
//     navigate('/admin/movies')
//   } catch (err) {
//     console.log("ADD MOVIE ERROR:", err.response);
//     setError(err.response?.data?.message || 'Failed to add movie');
//   } finally {
//     setLoading(false)
//   }
// }
try {
  const movieData = {
    ...formData,
    rating: parseFloat(formData.rating),
    duration: parseInt(formData.duration),
    genre: formData.genre ? formData.genre.split(",").map(g => g.trim()) : [],
    cast: formData.cast ? formData.cast.split(",").map(c => c.trim()) : [],
  };

  const response = await axios.post("/api/movies", movieData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  setSnackbar({
    open: true,
    message: "Movie added successfully!",
    severity: "success",
  });

  setTimeout(() => navigate("/admin/movies"), 1200);

} catch (err) {
  setSnackbar({
    open: true,
    message: err.response?.data?.message || "Failed to add movie",
    severity: "error",
  });
}}

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0b0b0f',
        py: 4,
      }}
    >
      <Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <MuiAlert
    elevation={6}
    variant="filled"
    severity={snackbar.severity}
    onClose={() => setSnackbar({ ...snackbar, open: false })}
  >
    {snackbar.message}
  </MuiAlert>
</Snackbar>

      <Container maxWidth="md">
        <Box
          sx={{
            mb: 3,
            background: '#161820',
            p: 3,
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{
              color: '#f5f5f5',
            }}
          >
            Add New Movie
          </Typography>
        </Box>

        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            background: '#141414',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                backgroundColor: '#1f1f1f',
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#1f1f1f', color: '#f5f5f5' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#1f1f1f', color: '#f5f5f5' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rating (0-10)"
                  name="rating"
                  type="number"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#1f1f1f', color: '#f5f5f5' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 1 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#1f1f1f', color: '#f5f5f5' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Release Date"
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#1f1f1f', color: '#f5f5f5' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Director"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#1f1f1f', color: '#f5f5f5' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Genre (comma-separated)"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="Action, Drama, Thriller"
                  helperText="Separate multiple genres with commas"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#1f1f1f', color: '#f5f5f5' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cast (comma-separated)"
                  name="cast"
                  value={formData.cast}
                  onChange={handleChange}
                  placeholder="Actor 1, Actor 2, Actor 3"
                  helperText="Separate multiple actors with commas"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#1f1f1f', color: '#f5f5f5' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Poster URL"
                  name="poster"
                  value={formData.poster}
                  onChange={handleChange}
                  placeholder="https://example.com/poster.jpg"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#1f1f1f', color: '#f5f5f5' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      background: '#e50914',
                      boxShadow: '0 6px 20px rgba(229,9,20,0.35)',
                      '&:hover': {
                        background: '#b81d24',
                        boxShadow: '0 10px 28px rgba(229,9,20,0.45)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? 'Adding...' : 'Add Movie'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/admin/movies')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      color: '#667eea',
                      borderColor: 'rgba(102, 126, 234, 0.5)',
                      '&:hover': {
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.08)',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default AddMovie

