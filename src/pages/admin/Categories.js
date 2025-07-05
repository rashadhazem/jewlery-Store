import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import  {getAllCategories ,deleteCategory,updateCategory,createCategory} from '../../utils/apiService';
import { toast } from 'react-toastify';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ _id: null, name: '' });

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getAllCategories();
    setCategories(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDialogOpen = (category = { _id: null, name: '' }) => {
    setEditMode(!!category._id);
    setCurrentCategory(category);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentCategory({ _id: null, name: '' });
  };

  const handleSubmit = async () => {
    const { _id, name } = currentCategory;
    if (!name.trim()) return;

    if (editMode) {
      
      const updated = await updateCategory(_id, name);
      if(updated.success){
        toast.success("the Category updated  success");
         setCategories((prev) =>
        prev.map((cat) => (cat._id === _id ? updated : cat))
      );
        fetchCategories();
       
      }
      else{
        toast.error("An error happend try again ");
      }
    } else {
      const newCat = await createCategory({ name });
      
      if(newCat.success){
        toast.success("The Category is  added");
      }
      else{
        toast.error("Error happen  when create new Category ");
      }
      setCategories((prev) => [...prev, newCat]);
      fetchCategories();
    }

    handleDialogClose();
  };

  const handleDelete = async (id) => {
    const req =await deleteCategory(id);
    if (req.success){
      toast.success(req.message);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
     
    }
    else{
      toast.error("Error !  try again ");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Manage Categories</Typography>
        <Button variant="contained" onClick={() => handleDialogOpen()}>
          Add Category
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell>{cat._id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleDialogOpen(cat)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(cat._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Dialog for Add/Edit */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editMode ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={currentCategory.name}
            onChange={(e) =>
              setCurrentCategory((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageCategories;
