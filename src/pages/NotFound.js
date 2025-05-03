// src/pages/NotFound.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const NotFound = () => {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h2" color="error">404</Typography>
      <Typography variant="h5">Page Not Found</Typography>
    </Box>
  );
};

export default NotFound;
