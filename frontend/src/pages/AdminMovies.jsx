import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import api from '../config/api'
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const AdminMovies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, movieId: null, movieTitle: '' })
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate()

  const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success", // "error", "warning", "info"
});


  useEffect(() => {
  fetchMovies();

  const msg = localStorage.getItem("movieSuccess");
  if (msg) {
    setSuccessMsg(msg);
    localStorage.removeItem("movieSuccess");
  }
}, []);


  const fetchMovies = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/movies', { params: { limit: 1000 } })
      setMovies(response.data.movies)
    } catch (err) {
      setError('Failed to fetch movies')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`/api/movies/${deleteDialog.movieId}`, {
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem('token')}`,
//   },
// });
//       setDeleteDialog({ open: false, movieId: null, movieTitle: '' })
//       fetchMovies()
//     } catch (err) {
//       setError('Failed to delete movie')
//     }
//   }
const handleDelete = async () => {
  try {
    await api.delete(`/api/movies/${deleteDialog.movieId}`);

    setDeleteDialog({ open: false, movieId: null, movieTitle: "" });

    setSnackbar({
      open: true,
      message: "Movie deleted successfully!",
      severity: "success",
    });

    fetchMovies();
  } catch (err) {
    setSnackbar({
      open: true,
      message: err.response?.data?.message || "Failed to delete movie",
      severity: "error",
    });
  }
};

  const openDeleteDialog = (movieId, movieTitle) => {
    setDeleteDialog({ open: true, movieId, movieTitle })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, movieId: null, movieTitle: '' })
  }

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

      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            background: '#161820',
            p: 3,
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
            flexWrap: 'wrap',
            gap: 2,
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
            Admin - Manage Movies
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/add-movie')}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              background: '#e50914',
              boxShadow: '0 6px 20px rgba(229,9,20,0.35)',
              '&:hover': {
                background: '#b81d24',
                boxShadow: '0 10px 28px rgba(229,9,20,0.45)',
              },
            }}
          >
            Add Movie
          </Button>
        </Box>

        {successMsg && (
  <Alert
    severity="success"
    sx={{
      mb: 3,
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      background: '#1f1f1f',
      color: 'white',
    }}
    onClose={() => setSuccessMsg("")}
  >
    {successMsg}
  </Alert>
)}


        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              background: '#1f1f1f',
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Table>
              <TableHead sx={{ background: 'rgba(102,126,234,0.08)' }}>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Release Date</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No movies found
                    </TableCell>
                  </TableRow>
                ) : (
                  movies.map((movie) => (
                    <TableRow key={movie._id} hover>
                      <TableCell>{movie.title}</TableCell>
                      <TableCell>{movie.rating?.toFixed(1) || 'N/A'}</TableCell>
                      <TableCell>
                        {movie.releaseDate
                          ? new Date(movie.releaseDate).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{movie.duration ? `${movie.duration} min` : 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/admin/edit-movie/${movie._id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openDeleteDialog(movie._id, movie.title)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
          <DialogTitle>Delete Movie</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{deleteDialog.movieTitle}"? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default AdminMovies

