import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ScaleIcon from '@mui/icons-material/Scale';
import LayersIcon from '@mui/icons-material/Layers';
import {addToWishlist ,addToCart} from "../utils/apiService";
import { toast } from 'react-toastify';


const MotionCard = motion(Card);

const ProductCard = ({ product }) => {
  const [isFavorited, setIsFavorited] = useState(false); // لاحتفظ بحالة المفضلة
  const [isAddToCart,setAddToCart]=useState(false);
  const token = localStorage.getItem('token');
  const handleToCartClick = async () => {
    try {
      const response = await addToCart(product._id);
       console.log(response);
      if (response.success === true ) {
         setAddToCart(true); // تغيير حالة المفضلة
         toast.success('Product added to cart Successfully');
      } else {
        toast.error('Failed to add product added to cart');
      }
    } catch (error) {
      console.error('Error:', error);
      if(!token){
        toast.error('you must be  login first ');
      }else{
       toast.error('An error occurred while adding to favorites');
      }
    }
  };
  const handleFavoriteClick = async () => {
    try {
      const response = await addToWishlist(product._id);
      
      if (response.success === true ) {
        setIsFavorited(true); // تغيير حالة المفضلة
         toast.success('Product added to favorites');
      } else {
        toast.error('Failed to add product to favorites');
      }
    } catch (error) {
      console.error('Error:', error);
      if(!token){
        toast.error('you must be  login first ');
      }else{
      toast.error('An error occurred while adding to favorites');
      }
    }
  };

  return (
    <MotionCard
      whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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
        height="220"
        image={product.image || '/placeholder.jpg'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {product.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ height: 48, overflow: 'hidden' }}>
          {product.description || 'No description available'}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="h6" color="primary">
            ${product.price?.toFixed(2)}
          </Typography>
          <Box display="flex" alignItems="center">
            <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
            <Typography variant="body2" ml={0.5}>4.8</Typography>
          </Box>
        </Box>

        <Box mt={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CategoryIcon fontSize="small" />
            <Typography variant="body2">
              {product.category?.name || 'Uncategorized'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <InventoryIcon fontSize="small" />
            <Typography variant="body2">Stock: {product.stock}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LayersIcon fontSize="small" />
            <Typography variant="body2">Material: {product.material || 'N/A'}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <ScaleIcon fontSize="small" />
            <Typography variant="body2">Weight: {product.weight || 'N/A'} g</Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Tooltip title="Add to Cart">
          <IconButton 
          color={isAddToCart ? 'error' : 'primary'}
          onClick={handleToCartClick}
          >
            <ShoppingCartIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add to Wishlist">
          <IconButton
            color={isFavorited ? 'error' : 'secondary'} // تغيير اللون بناءً على المفضلة
            onClick={handleFavoriteClick}
          >
            <FavoriteBorderIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </MotionCard>
  );
};

export default ProductCard;
