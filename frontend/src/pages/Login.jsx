import { useState } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

const [toast, setToast] = useState({
  open: false,
  message: "",
  severity: "success",
  key: 0,
});

const handleToastClose = (event, reason) => {
  if (reason === "clickaway") return;
  setToast((prev) => ({ ...prev, open: false }));
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const result = await login(email, password);

    if (result?.success) {
      setToast({
        open: true,
        message: "Login successful ",
        severity: "success",
        key: new Date().getTime(),
      });

      setTimeout(() => navigate("/"), 800);
    } else {
      setToast({
        open: true,
        message: result?.message || "Invalid email or password",
        severity: "error",
        key: new Date().getTime(),
      });
    }
  } catch (error) {
    setToast({
      open: true,
      message: "Something went wrong. Please try again.",
      severity: "error",
      key: new Date().getTime(),
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        background: '#0b0b0f',
        py: 4,
      }}
    >

<Snackbar
  key={toast.key}
  open={toast.open}
  autoHideDuration={3000}
  onClose={handleToastClose}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <MuiAlert
    elevation={6}
    variant="filled"
    severity={toast.severity}
    onClose={handleToastClose}
  >
    {toast.message}
  </MuiAlert>
</Snackbar>


      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 5,
            borderRadius: 4,
            background: '#141414',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{
                color: '#f5f5f5',
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account to continue
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              autoComplete="email"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#1f1f1f',
                  color: '#f5f5f5',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              autoComplete="current-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#1f1f1f',
                  color: '#f5f5f5',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                mb: 3,
                py: 1.5,
                borderRadius: 2,
                background: '#e50914',
                boxShadow: '0 6px 20px rgba(229,9,20,0.35)',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: '#b81d24',
                  boxShadow: '0 10px 28px rgba(229,9,20,0.45)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Typography variant="body2" align="center" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  color: '#e50914',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login

