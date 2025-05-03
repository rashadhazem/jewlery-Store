import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import CartItem from '../components/CartItem';
import { getCart, removeFromCart, updateCartItem } from '../utils/apiService';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCartItems(res.data.items);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await removeFromCart({ productId });
      if (res) {
        toast.success("Product removed successfully from cart");
      }
      setCartItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const quantity = newQuantity;
      const response = await updateCartItem(productId, quantity );
      
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          My Cart
        </Typography>
        {cartItems.length > 0 ? (
          <Box display="flex" flexWrap="wrap" gap={3}>
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body1">The cart is empty.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Cart;
