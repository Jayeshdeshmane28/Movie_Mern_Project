import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  Pagination,
  CircularProgress,
  Alert,
  InputAdornment,
  Chip,
} from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import StarIcon from '@mui/icons-material/Star'
import axios from 'axios'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

  const navigate = useNavigate()

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults()
    }
  }, [page, searchQuery])

  const fetchSearchResults = async () => {
    if (!searchQuery.trim()) {
      setMovies([])
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await axios.get('/api/movies/search', {
        params: {
          q: searchQuery,
          page,
          limit: 12,
        },
      })

      setMovies(response.data.movies)
      setTotalPages(response.data.pagination.pages)
    } catch (err) {
      setError('Failed to search movies. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setSearchParams({ q: searchQuery })
    fetchSearchResults()
  }

  const handlePageChange = (event, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 20% 20%, rgba(229,9,20,0.08), transparent 25%), radial-gradient(circle at 80% 0%, rgba(229,9,20,0.12), transparent 25%), #0b0b0f',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: 4,
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
              mb: 3,
              color: '#f5f5f5',
            }}
          >
            Search Movies
          </Typography>

          <Box component="form" onSubmit={handleSearch}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search movies by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#e50914' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: '#1f1f1f',
                  color: '#f5f5f5',
                },
              }}
            />
          </Box>
        </Box>

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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : searchQuery && movies.length === 0 ? (
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              mt: 4,
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              p: 3,
              borderRadius: 2,
            }}
          >
            No movies found for "{searchQuery}"
          </Typography>
        ) : searchQuery && movies.length > 0 ? (
          <>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: '#f5f5f5',
              background: 'rgba(255, 255, 255, 0.08)',
              p: 2,
              borderRadius: 2,
            }}
          >
            Found {movies.length} result(s) for "{searchQuery}"
          </Typography>
          <Grid container spacing={2.5}>
            {movies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                    backgroundColor: '#16171d',
                    border: '1px solid rgba(255,255,255,0.05)',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 18px 50px rgba(0, 0, 0, 0.45)',
                    },
                  }}
                  onClick={() => navigate(`/movie/${movie._id}`)}
                >
                  <CardMedia
                    component="img"
                    height="280"
                    image={
                      movie.poster ||
                      'https://placehold.co/400x600/1f1f1f/FFFFFF?text=No+Image'
                    }
                    alt={movie.title}
                    sx={{
                      objectFit: 'cover',
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://placehold.co/400x600/1f1f1f/FFFFFF?text=No+Image'
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography
                      variant="h6"
                      component="h2"
                      fontWeight="bold"
                      sx={{
                        mb: 1,
                        fontSize: '1rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        color: '#f5f5f5',
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                      <Typography variant="body2" fontWeight="medium" sx={{ color: '#f5f5f5' }}>
                        {movie.rating?.toFixed(1) || 'N/A'}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 1,
                        color: '#d0d0d0',
                      }}
                    >
                      {movie.description}
                    </Typography>
                    {movie.genre && movie.genre.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {movie.genre.slice(0, 2).map((g, idx) => (
                          <Chip
                            key={idx}
                            label={g}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              borderRadius: 2,
                              backgroundColor: 'rgba(255,255,255,0.08)',
                              color: '#f5f5f5',
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="standard"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      color: '#fff',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.2)',
                    },
                    '& .MuiPaginationItem-root.Mui-selected': {
                      backgroundColor: '#fff',
                      color: '#5a6fd6',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                    },
                    '& .MuiPaginationItem-root:hover': {
                      backgroundColor: 'rgba(255,255,255,0.25)',
                    },
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              mt: 4,
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              p: 3,
              borderRadius: 2,
            }}
          >
            Enter a search query to find movies
          </Typography>
        )}
      </Container>
    </Box>
  )
}

export default Search

