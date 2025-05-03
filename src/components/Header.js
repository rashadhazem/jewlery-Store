import {React,useEffect} from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
  Diamond,
  Storefront,
  ShoppingCart,
  Favorite,
  ListAlt,
  Dashboard,
  Logout,
  Login,
  PersonAdd
} from '@mui/icons-material';

const Header = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(45deg, #3f51b5 30%, #9c27b0 90%)',
      }}
    >
      <Toolbar>
        <Diamond sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Jewelry Store
          </Link>
        </Typography>

        <Box sx={{ display: 'flex', gap: 4 }}> {/* gap controls space between buttons */}
          <Button color="inherit" component={Link} to="/products" startIcon={<Storefront />}>
            Products
          </Button>

          {user ? (
            <>
              <Button color="inherit" component={Link} to="/cart" startIcon={<ShoppingCart />}>
                Cart
              </Button>
              <Button color="inherit" component={Link} to="/wishlist" startIcon={<Favorite />}>
                Favorite
              </Button>
              <Button color="inherit" component={Link} to="/orders" startIcon={<ListAlt />}>
                Orders
              </Button>
              {user.role === 'admin' && (
                <Button color="inherit" component={Link} to="/admin/dashboard" startIcon={<Dashboard />}>
                  Dashboard
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" startIcon={<Login />}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register" startIcon={<PersonAdd />}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
