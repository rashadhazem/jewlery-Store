import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fade,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LayersIcon from '@mui/icons-material/Layers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {getAdminDashboardStats} from '../utils/apiService'; // Adjust the import path as necessary


const statCards = [
  {
    label: 'Total Users',
    valueKey: 'users',
    icon: <PeopleAltIcon sx={{ fontSize: 40, color: '#fff' }} />,
    bgColor: '#3f51b5',
  },{
    label: 'Total Revenue',
    valueKey: 'earnings',
    icon: <AttachMoneyIcon sx={{ fontSize: 40, color: '#fff' }} />,
    bgColor: '#4caf50',
  },
  {
    label: 'Total Products',
    valueKey: 'products',
    icon: <StorefrontIcon sx={{ fontSize: 40, color: '#fff' }} />,
    bgColor: '#009688',
  },
  {
    label: 'Total Orders',
    valueKey: 'orders',
    icon: <ReceiptLongIcon sx={{ fontSize: 40, color: '#fff' }} />,
    bgColor: '#ff5722',
  },
  {
    label: 'Total Categories',
    valueKey: 'categories',
    icon: <LayersIcon sx={{ fontSize: 40, color: '#fff' }} />,
    bgColor: '#9c27b0',
  },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    categories: 0,
    earnings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboardStats();
        console.log(res);
        if (res && res.data) {
          res.data.earnings = parseInt(res.data.earnings, 10); // Ensure earnings is defined
          setStats(res.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Sidebar */}
        <Paper
          sx={{
            width: 250,
            p: 2,
            height: 'fit-content',
            bgcolor: '#f0f2f5',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Admin Panel
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {[
              { text: 'Dashboard', icon: <DashboardIcon />, link: '/admin/' },
              { text: 'Manage Users', icon: <GroupIcon />, link: '/admin/Users' },
              { text: 'Manage Products', icon: <InventoryIcon />, link: '/admin/Products' },
              { text: 'Manage Orders', icon: <ShoppingCartIcon />, link: '/admin/Orders' },
              { text: 'Manage Categories', icon: <CategoryIcon />, link: '/admin/Categories' },
            ].map((item, index) => (
              <ListItem
                button
                component={Link}
                to={item.link}
                key={index}
                sx={{
                  borderRadius: 1,
                  transition: '0.3s',
                  '&:hover': {
                    bgcolor: '#e0e0e0',
                    transform: 'translateX(5px)',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Dashboard Content */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            Admin Statistics
          </Typography>
          <Grid container spacing={3}>
            {statCards.map((card, i) => (
              <Grid item xs={12} sm={6} md={3} key={card.valueKey}>
                <Fade in={true} timeout={500 + i * 200}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: card.bgColor,
                      color: '#fff',
                      borderRadius: 3,
                      height: 160,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    {card.icon}
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h4">{stats[card.valueKey]}</Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
