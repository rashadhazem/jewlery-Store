// src/pages/Register.js
import React from 'react';
import {TextField, Button, Typography, Box, Paper, Link as MuiLink } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const Register = () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('/auth/register', values);
      if (response) {
         toast.success('Registration successful!');
        navigate('/verify-otp');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 30%, #f3e5f5 90%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          maxWidth: 500,
          animation: 'fadeIn 1s ease-in-out',
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Create Account
        </Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                name="name"
                label="Name"
                fullWidth
                margin="normal"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                Register
              </Button>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" color="primary">
                  Login
                </MuiLink>
              </Typography>
            </Form>
          )}
        </Formik>
      </Paper>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default Register;
