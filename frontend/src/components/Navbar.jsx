import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import MovieIcon from '@mui/icons-material/Movie'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkButtonSx = {
    color: '#f5f5f5',
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 2,
    px: 2.5,
'&:hover': {
  backgroundColor: '#b81d24',
  boxShadow: '0 0 10px rgba(229,9,20,0.35)',
}

  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(180deg, #0d0f15 0%, #0b0c12 60%, #0d0f15 100%)',
        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.55)',
        borderBottom: '1px solid rgba(229,9,20,0.25)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            py: 1.2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* LEFT SIDE — LOGO + TITLE */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <IconButton
              component={Link}
              to="/"
              sx={{
                color: '#e50914',
                backgroundColor: 'rgba(229,9,20,0.08)',
                '&:hover': { backgroundColor: 'rgba(229,9,20,0.16)' },
              }}
            >
              <MovieIcon />
            </IconButton>

            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: '#f5f5f5',
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
            >
              SurfFlix
            </Typography>
          </Box>

          {/* RIGHT SIDE — MENU ITEMS */}
          <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
            <Button sx={linkButtonSx} component={Link} to="/">
              Home
            </Button>

            <Button sx={linkButtonSx} component={Link} to="/search">
              Search
            </Button>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <>
                    <Button sx={linkButtonSx} component={Link} to="/admin/movies">
                      Admin
                    </Button>
                    <Button sx={linkButtonSx} component={Link} to="/admin/add-movie">
                      Add Movie
                    </Button>
                  </>
                )}

                <Button sx={linkButtonSx} onClick={handleLogout}>
                  Logout ({user.username})
                </Button>
              </>
            ) : (
              <Button sx={linkButtonSx} component={Link} to="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
