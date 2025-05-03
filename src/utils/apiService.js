// apiService.js
import axios from './axiosInstance';

// ✅ Auth
export const registerUser = (data) => axios.post('/auth/register', data);
export const loginUser = (data) => axios.post('/auth/login', data);
export const verifyOTP = (data) => axios.post('/auth/verify-otp', data);

// ✅ Products
export const getAllProducts = async () => {
    const response = await axios.get('/products');
    return response.data; 
  };
export const getProductById = async (id) => {
 const response=await axios.get(`/products/${id}`);
 return response.data;
}




export const filterProducts = async (filters = {}) => {
  const { name, category, minPrice, maxPrice } = filters;

  // 1. Search by name api/products/search?name=ring
  if (name) {
    const res = await axios.get('/products/search', { params: { name } });
    return res.data;
  }

  // 2. Filter by price //GET /api/products/filter?gt=100&lt=500
  if (minPrice || maxPrice) {
    const params = {};
    if (minPrice) params.gt = minPrice;
    if (maxPrice) params.lt = maxPrice;
    const res = await axios.get('/products/filter', { params });
    return res.data.data;
  }

  // 3. Filter by category onlyhttp://localhost:5000/api/categories/rings/products
  if (category) {
    const res = await axios.get(`/categories/${category}/products`);
    return res.data.data;
  }

  // 4. Get all products
  const res = await axios.get('/products');
  return res;
};
// ✅ Cart
export const getCart =async () =>{
  const response =await axios.get('/cart');
  return response.data;
}
export const addToCart = async (productId) =>{
   const response=await axios.post(`/cart`, { productId , quantity: 1});
   return response.data;
}
export const removeFromCart = async (productId) =>{
  const response=await axios.delete(`/cart/${productId}`);
  return response.data;
}
export const updateCartItem = async (productId, quantity) => {
  const response = await axios.patch(`/cart/${productId}`,
    {productId, quantity}
  );
  return response.data;
};
export const clearCart= async ()=>{
  const response =await axios.delete('/cart');
  return response.data;
}

// ✅ Wishlist

export const getWishlist = async () => {
  const response=await axios.get('/favorite');
return response.data;
}

export const addToWishlist = async (productId) => {
  const response=await axios.post('/favorite/add', {productId});
  return response.data;
}
export const removeFromWishlist = async(productId) =>{
  const response=await axios.delete(`/favorite/${productId}`);
  return response;
}
// ✅ Orders
export const createOrder = async(orderData) => {
  const response =await axios.post('/orders', orderData);
  return response;
}

export const getUserOrders = async() => {
  const  response= await axios.get('/orders/myorders');
return response.data;
}

export const getOrderById = async(orderId) => {
  const response=await axios.get(`/orders/${orderId}`);
  return response.data;
}
//✅ category 
export const getAllCategories=async()=>{
  const response=await axios.get('/categories');
  return response.data;

}
export const getProductByCategoryName=async(name)=>{
  const response=await axios.get(`/categories/${name}/products`);
  return response.data;
}


// ✅ Dashboard (Admin only)
export const getDashboardStats = () => axios.get('/dashboard');
export const getAllOrders = () => axios.get('/orders/all');

