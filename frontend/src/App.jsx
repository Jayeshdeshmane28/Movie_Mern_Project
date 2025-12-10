import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import AddMovie from './pages/AddMovie'
import EditMovie from './pages/EditMovie'
import MovieDetails from './pages/MovieDetails'
import AdminMovies from './pages/AdminMovies'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return user && user.role === 'admin' ? children : <Navigate to="/" />
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/movies"
          element={
            <AdminRoute>
              <AdminMovies />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-movie"
          element={
            <AdminRoute>
              <AddMovie />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-movie/:id"
          element={
            <AdminRoute>
              <EditMovie />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App



