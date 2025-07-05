"use client";

import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress, MenuItem, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import {
  updateProduct,
  deleteProduct,
  addProduct,
  getAllProducts,
  getAllCategories
} from '../../utils/apiService';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    _id: null,
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    material: '',
    stock: '',
    weight: '',
    createdAt: '',
    updatedAt: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    //console.log(data);
    setProducts(data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const data = await getAllCategories();
    
    setCategories(data.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDialogOpen = (product = {
    _id: null, name: '', price: '', category: '', description: '',
    image: '', material: '', stock: '', weight: ''
  }) => {
    setEditMode(!!product._id);
    setCurrentProduct(product);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentProduct({
      _id: null, name: '', price: '', category: '', description: '',
      image: '', material: '', stock: '', weight: ''
    });
  };
const preparePayload = (product) => ({
  ...product,
  category: typeof product.category === 'object' ? product.category._id : product.category,
});
  const handleSubmit = async () => {
    const { _id, name, price, category } = currentProduct;

    if (!name.trim() || !price || !category) {
      alert('Please fill all required fields.');
      return;
    }
 const payload = preparePayload(currentProduct);
    if (editMode) {
      console.log("currentProduct",currentProduct);
      const updated = await updateProduct(_id, payload);
      console.log("updated",updated);
      if (updated.success) {
        toast.success("Product updated successfully");
          fetchProducts(); // Refresh products after update
      } else {
        toast.error("Error updating product");
      }
   
    } else {
      const newProd = await addProduct(currentProduct);
      console.log("newProd",newProd);
      if (newProd.success) {
        toast.success("Product added successfully");
      } else {
        toast.error("Error adding product");
      }
     
      fetchProducts();
    }

    handleDialogClose();
  };

  const handleDelete = async (id) => {
    const deleteProd  = await deleteProduct(id);
    console.log("deleteProd",deleteProd);
    if (deleteProd) {
      toast.success("Product deleted successfully");
      fetchProducts(); // Refresh products after deletion
    } else {
      toast.error("Error deleting product");
      fetchProducts();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Manage Products</Typography>
        <Button variant="contained" onClick={() => handleDialogOpen()}>
          Add Product
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflowX: 'auto' }}>
          <Box sx={{ minWidth: 1200 }}>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell align="right" sx={{
                    position: 'sticky',
                    right: 0,
                    backgroundColor: '#fff',
                    zIndex: 1,
                  }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((prod) => (
                  <TableRow key={prod._id} sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                    '&:hover': { backgroundColor: '#e0f7fa', cursor: 'pointer' },
                  }}>
                    <TableCell>{prod._id}</TableCell>
                    <TableCell>
                      <img
                        src={prod.image || '/placeholder.jpg'}
                        alt={prod.name}
                        style={{ width: 100 }}
                      />
                    </TableCell>
                    <TableCell>{prod.name}</TableCell>
                    <TableCell>${prod.price}</TableCell>
                    <TableCell>{prod.category?.name || prod.category}</TableCell>
                    <TableCell>{prod.description}</TableCell>
                    <TableCell>{prod.material}</TableCell>
                    <TableCell>{prod.stock}</TableCell>
                    <TableCell>{prod.weight}</TableCell>
                    <TableCell>{prod.createdAt ? new Date(prod.createdAt).toLocaleString() : '-'}</TableCell>
                    <TableCell>{prod.updatedAt ? new Date(prod.updatedAt).toLocaleString() : '-'}</TableCell>
                    <TableCell align="right" sx={{
                      position: 'sticky',
                      right: 0,
                      backgroundColor: '#fff',
                      zIndex: 1,
                    }}>
                      <IconButton color="primary" onClick={() => handleDialogOpen(prod)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(prod._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                margin="dense"
                value={currentProduct.name}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                fullWidth
                margin="dense"
                type="number"
                value={currentProduct.price}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                fullWidth
                margin="dense"
                select
                value={currentProduct.category}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id || cat} value={cat._id || cat}>
                    {cat.name || cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Material"
                fullWidth
                margin="dense"
                value={currentProduct.material}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({ ...prev, material: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock"
                fullWidth
                margin="dense"
                type="number"
                value={currentProduct.stock}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({ ...prev, stock: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Weight (kg)"
                fullWidth
                margin="dense"
                type="number"
                value={currentProduct.weight}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({ ...prev, weight: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                fullWidth
                margin="dense"
                value={currentProduct.image}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({ ...prev, image: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                margin="dense"
                multiline
                rows={4}
                value={currentProduct.description}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageProducts;
