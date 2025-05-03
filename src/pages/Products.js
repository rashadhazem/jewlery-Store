import React, { useEffect, useState } from 'react';
import { Container, Grid, TextField, Typography, Box, Button, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import ProductCard from '../components/ProductCard';
import {filterProducts,getAllProducts,getAllCategories } from '../utils/apiService';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ name: '', category: '', minPrice: '', maxPrice: '' });
  const[isFilter,setIsFailter]=useState(false);
  const token = localStorage.getItem('token');
  const [categories, setCategories] = useState([]);

  const fetchCategory=async()=>{
    try{
       const response = await getAllCategories ();
       setCategories(response.data);
    }
    catch(error){
      console.log(error)
    }
  }
  const fetchProducts = async () => {
    try {
      let response ;
      const isAnyFilterActive =
        filters.name || filters.category || filters.minPrice || filters.maxPrice;
        if (isAnyFilterActive) {
          response = await filterProducts(filters);
          setProducts(response);
          console.log(filters); 
          console.log(response);
        } else {
          response = await getAllProducts();
          setProducts(response);
        }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
       fetchProducts();
  }, [filters]);
  fetchCategory();
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setIsFailter(true);
  };

  const clearFilters = () => {
    setFilters({ name: '', category: '', minPrice: '', maxPrice: '' });
    setIsFailter(false);
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, marginTop: 5 }}>
        {/* Filter Sidebar */}
        <Box
          sx={{
            width: 280,
            padding: 3,
            bgcolor: '#f4f4f9',
            borderRadius: 1,
            boxShadow: 2,
            position: 'sticky',
            top: 0,
            height: 'fit-content', // Fix the issue where the height was stretched
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
            Filters
          </Typography>

          {/* Filter for Category */}
          <Paper sx={{ mb: 2, padding: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                label="Category"
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="">All Categories</MenuItem>
                 {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)} {/* Capitalize */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* Filter for Price Range */}
          <Paper sx={{ mb: 2, padding: 2 }}>
            <TextField
              label="Min Price"
              name="minPrice"
              type="number"
              fullWidth
              value={filters.minPrice}
              onChange={handleFilterChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Max Price"
              name="maxPrice"
              type="number"
              fullWidth
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </Paper>

          {/* Clear Filters Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={clearFilters}
            sx={{ mt: 2 }}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Product Grid */}
        <Box sx={{ flexGrow: 1, ml: 2, width: '100%' }}>
          <Typography variant="h4" gutterBottom align="center">
            Our Products
          </Typography>

          <Grid container spacing={3}>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))
            ) : (
              <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
                No products found.
              </Typography>
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Products;
