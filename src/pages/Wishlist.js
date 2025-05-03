// src/pages/Wishlist.js
import { Container, Typography, Grid} from '@mui/material';
import React, { useEffect, useState } from 'react';
import WishlistItem from '../components/WishlistItem';
import {getWishlist,removeFromWishlist ,addToCart} from "../utils/apiService";


const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);


  // Fetch wishlist items from backend
  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      console.log(res);
      setWishlist(res.favorite.products|| []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await removeFromWishlist(id);
      console.log(res);
      setWishlist((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleMoveToCart = async (id) => {
    try {
      // Example: you might have an API to move item to cart
      await addToCart();
      handleRemove(id); // remove from wishlist after moving
    } catch (err) {
      console.error('Error moving to cart:', err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Wishlist
      </Typography>

      {wishlist.length === 0 ? (
        <Typography>No items in wishlist.</Typography>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <WishlistItem
                item={item}
                onRemove={handleRemove}
                onMoveToCart={handleMoveToCart}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
export default Wishlist;
