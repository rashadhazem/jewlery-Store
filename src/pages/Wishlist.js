// src/pages/Wishlist.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import WishlistItem from '../components/WishlistItem';
import {getWishlist,removeFromWishlist ,addToCart} from "../utils/apiService";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);



  const fetchWishlistItems = async () => {
    try {
      const data = await getWishlist();
      console.log("Response from getWishlist:", data);
      setLoading(true);
      if (data.success) {
        setWishlistItems(data.favorite.products);
      } else {
        toast.error(data.message || 'Failed to fetch wishlist items');
      }
    } catch (error) {
      toast.error('Error fetching wishlist items');
    } finally {
      setLoading(false);
    }
  };
 useEffect(() => {
    fetchWishlistItems();
  }, []);
  const removeFromWishlist = async (productId) => {
    try {
      const response = await removeFromWishlist(productId);
      if (response.ok) {
        fetchWishlistItems();
        toast.success('Item removed from wishlist');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to remove item');
      }
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await addToCart(productId);
      
      if (response.ok) {
        toast.success('Item added to cart');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      toast.error('Error adding item to cart');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {wishlistItems.map((item) => (
           <WishlistItem
              key={item._id}
              item={item}
              onRemove={() => removeFromWishlist(item._id)}
              onMoveToCart={() => addToCart(item._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
