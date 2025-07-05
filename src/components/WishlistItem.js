import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Box,
  CardActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import { toast } from 'react-toastify';
import {removeFromWishlist ,addToCart} from "../utils/apiService";

const WishlistItem = ({ item, onRemove ,onMoveToCart}) => {
  const handleMoveToCart = async () => {
    try {
      const response = await addToCart(
         item._id
      );
      console.log("responsr",response.data);
      if (response) {
        console.log(response);
        toast.success('Product moved to cart');
        onRemove(item._id);
        
      } else {
        toast.error('Failed to move product to cart');
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
      toast.error('An error occurred while moving to cart');
    }
  };

  const handleRemove = async () => {
    try {
      const response = await removeFromWishlist(item._id);
      if (response.status === 200) {
        toast.success('Product removed from wishlist');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error('Failed to remove product');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('An error occurred while removing from wishlist');
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        maxWidth: 260,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={item.image || '/placeholder.jpg'}
        alt={item.name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" noWrap>
          {item.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ height: 40, overflow: 'hidden' }}>
          {item.description || 'No description available'}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="h6" color="primary">
            ${item.price?.toFixed(2)}
          </Typography>
          <Box display="flex" alignItems="center">
            <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
            <Typography variant="body2" ml={0.5}>4.8</Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Tooltip title="Move to Cart">
          <IconButton color="primary" onClick={handleMoveToCart}>
            <ShoppingCartIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Remove from Wishlist">
          <IconButton color="error" onClick={handleRemove}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default WishlistItem;
