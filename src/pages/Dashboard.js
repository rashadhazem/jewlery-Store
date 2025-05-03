// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import axios from '../utils/axiosInstance';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    earnings: 0,
    products: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>لوحة التحكم</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">عدد المستخدمين</Typography>
              <Typography variant="h4">{stats.users}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">عدد الطلبات</Typography>
              <Typography variant="h4">{stats.orders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">عدد المنتجات</Typography>
              <Typography variant="h4">{stats.products}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">الإجمالي</Typography>
              <Typography variant="h4">${stats.earnings}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
