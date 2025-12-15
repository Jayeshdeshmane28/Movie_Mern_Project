import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Rating,
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import IconButton from '@mui/material/IconButton'
import api from '../config/api'

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMovieDetails()
  }, [id])

  const fetchMovieDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/movies/${id}`)
      setMovie(response.data.movie)
    } catch (err) {
      setError('Failed to fetch movie details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error || !movie) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Movie not found'}</Alert>
      </Container>
    )
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        animation: 'fadeIn 0.4s ease-in-out',
        '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
      }}
    >
      {/* Enhanced Back Button */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: '#f5f5f5',
          backgroundColor: 'rgba(255,255,255,0.08)',
          px: 2,
          py: 1,
          borderRadius: 2,
          transition: '0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.15)',
            transform: 'translateX(-4px)',
          },
        }}
      >
        <ArrowBackIcon />
        <Typography>Back</Typography>
      </IconButton>

      <Grid container spacing={5}>
        
        {/* Poster */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={6}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0px 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <Box
              component="img"
              src={movie.poster || 'https://via.placeholder.com/400x600?text=No+Image'}
              alt={movie.title}
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Paper>
        </Grid>

        {/* Movie Info */}
        <Grid item xs={12} md={8}>
          
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ mb: 2, color: '#fff' }}
          >
            {movie.title}
          </Typography>

          {/* Rating Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Rating value={movie.rating / 2} precision={0.1} readOnly size="large" />
            <Typography variant="h6" fontWeight="medium">
              {movie.rating?.toFixed(1)} / 10
            </Typography>
          </Box>

          <Typography variant="body1" paragraph sx={{ mb: 3, color: '#ccc' }}>
            {movie.description}
          </Typography>

          {/* Release/Duration/Director */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="gray">Release Date</Typography>
              <Typography variant="body1" fontWeight="bold">
                {new Date(movie.releaseDate).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="gray">Duration</Typography>
              <Typography variant="body1" fontWeight="bold">
                {movie.duration} minutes
              </Typography>
            </Grid>

            {movie.director && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="gray">Director</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {movie.director}
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* Genres */}
          {movie.genre?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="gray" sx={{ mb: 1 }}>
                Genres
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {movie.genre.map((g, idx) => (
                  <Chip
                    key={idx}
                    label={g}
                    sx={{
                      backgroundColor: '#e50914',
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Cast */}
          {movie.cast?.length > 0 && (
            <Box>
              <Typography variant="body2" color="gray" sx={{ mb: 1 }}>
                Cast
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {movie.cast.map((actor, idx) => (
                  <Chip
                    key={idx}
                    label={actor}
                    variant="outlined"
                    sx={{
                      borderColor: '#888',
                      color: '#ddd',
                      fontWeight: '500',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

        </Grid>
      </Grid>
    </Container>
  )
}

export default MovieDetails
