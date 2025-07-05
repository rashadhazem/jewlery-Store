import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly }) => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  
  const isAdmin = user.isAdmin === true;
 
  if (!token) return <Navigate to="/login" />;

  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
