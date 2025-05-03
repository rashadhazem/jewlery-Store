// src/pages/Orders.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Orders = () => {
  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          الطلبات
        </Typography>
        {/* سيتم إضافة مكونات الطلبات هنا */}
      </Box>
    </Container>
  );
};

export default Orders;
