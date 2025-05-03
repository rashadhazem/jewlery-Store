// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardMedia, CardContent,
  CardActions, Container, Chip, IconButton, Modal, Backdrop, Fade,
  Paper, Select, MenuItem, InputLabel, FormControl, styled
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Favorite,
  Diamond,
  Watch,
  LocalOffer,
  Star,
  ArrowForward,
  Circle,
  AccountTree,
  Hearing,
  Cable
} from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ScaleIcon from '@mui/icons-material/Scale';
import LayersIcon from '@mui/icons-material/Layers';
import { toast } from 'react-toastify';
import { getAllProducts, getAllCategories, addToWishlist, addToCart } from '../utils/apiService';

// ----- Styled Components ----- //
const HeroSection = styled(Box)({
  backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1470&q=80")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '80px 0',
  textAlign: 'center',
  position: 'relative',
  color: '#fff',
});

const CategoryCard = styled(Card)({
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const StyledProductCard = styled(Card)({
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
  },
});

// Modal style for product details
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
  width: '90%',
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};



const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // الحصول على البيانات عند تحميل الصفحة
  useEffect(() => {
    const getData = async () => {
      try {
        const prodData = await getAllProducts();
        const catData = await getAllCategories();
        setProducts(prodData);
        // تأكد انك بترجع بيانات التصنيفات بشكل مناسب (مثلاً catData.data)
        setCategories(catData.data || []);
      } catch (error) {
        console.error('Failed to fetch products/categories:', error);
      }
    };

    getData();
  }, []);

  // دالة لإضافة إلى المفضلة (Favorite)
  const handleFavorite = async (product) => {
    try {
      const respos = await addToWishlist(product._id);
      console.log(respos);
      // هنا يمكنك عرض رسالة تأكيد أو تغيير الحالة في الواجهة
      toast.success('Product added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  // دالة لإضافة المنتج إلى السلة (Cart) مع التحقق من تسجيل الدخول
  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be SignIn First ");
    }
    try {
      await addToCart(product._id);
      toast.success('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // فتح مودال تفاصيل المنتج
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  // إغلاق المودال
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Container maxWidth="md">
            <Diamond color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #3f51b5 30%, #9c27b0 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Luxury Jewelry Collection
            </Typography>
            <Typography variant="h5" mb={4} color="gray">
              Discover exquisite pieces crafted with precision and passion
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/products"
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #3f51b5 30%, #9c27b0 90%)',
                }}
              >
                Shop Now
              </Button>
            </motion.div>
          </Container>
        </motion.div>
      </HeroSection>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
          Our Collections
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={category.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {category.icon}
                    </Box>
                    <Typography gutterBottom variant="h6" component="div">
                      {category.name}
                    </Typography>
                  </CardContent>
                  <Box sx={{ textAlign: 'center', pb: 2 }}>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/products?category=${category.name.toLowerCase()}`}
                      endIcon={<ArrowForward />}
                    >
                      View
                    </Button>
                  </Box>
                </CategoryCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Box sx={{ backgroundColor: 'background.paper', py: 8 }}>
  <Container maxWidth="lg">
    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
      Featured Products
    </Typography>
    <Grid container spacing={4}>
      {products.slice(0, 6).map((product, index) => (
        <Grid item xs={12} sm={6} md={4} key={product._id} sx={{ display: 'flex' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            style={{ width: '100%' }}
          >
            <StyledProductCard sx={{ height: '100%',width:'330px', display: 'flex', flexDirection: 'column', justifyContent:'space-around' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                {product.isNew && (
                  <Chip
                    label="New"
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                  />
                )}
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 10, 
                    right: 10, 
                    backgroundColor: 'rgba(255,255,255,0.8)' 
                  }}
                  aria-label="add to favorites"
                  onClick={() => handleFavorite(product)}
                >
                  <Favorite color="error" />
                </IconButton>
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button size="small" color="primary" onClick={() => handleViewDetails(product)}>
                  View Details
                </Button>
                <IconButton 
                  color="primary" 
                  aria-label="add to cart" 
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart />
                </IconButton>
              </CardActions>
            </StyledProductCard>
          </motion.div>
        </Grid>
      ))}
    </Grid>
    <Box sx={{ textAlign: 'center', mt: 6 }}>
      <Button 
        variant="outlined" 
        size="large" 
        component={Link} 
        to="/products"
        endIcon={<ArrowForward />}
        sx={{ px: 4, py: 1.5 }}
      >
        View All Products
      </Button>
    </Box>
  </Container>
</Box>


      {/* Special Offer Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Box sx={{ 
          backgroundColor: 'primary.main', 
          color: 'primary.contrastText', 
          py: 4,
          textAlign: 'center'
        }}>
          <Container maxWidth="md">
            <LocalOffer sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Summer Sale - Up to 30% Off
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Limited time offer on selected diamond collections
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={Link} 
              to="/products?promo=summer-sale"
              sx={{ px: 4, py: 1.5, fontWeight: 600 }}
            >
              Shop the Sale
            </Button>
          </Container>
        </Box>
      </motion.div>

      {/* Modal for Product Details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
  <Box sx={modalStyle}>
    {selectedProduct && (
      <>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <CardMedia
            component="img"
            image={selectedProduct.image}
            alt={selectedProduct.name}
            sx={{ maxHeight: 300, objectFit: "cover", borderRadius: 1 }}
          />
        </Box>

        {/* الاسم + السعر */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="h5">{selectedProduct.name}</Typography>
          <Typography variant="h6" color="primary">
            ${selectedProduct.price.toFixed(2)}
          </Typography>
        </Box>

        {/* الوصف */}
        <Typography variant="body1" sx={{ mb: 3 }}>
          {selectedProduct.description || "No description available."}
        </Typography>

        {/* بيانات إضافية */}
        <Box mt={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CategoryIcon fontSize="small" />
            <Typography variant="body2">
              {selectedProduct.category?.name || "Uncategorized"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <InventoryIcon fontSize="small" />
            <Typography variant="body2">
              Stock: {selectedProduct.stock}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LayersIcon fontSize="small" />
            <Typography variant="body2">
              Material: {selectedProduct.material || "N/A"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <ScaleIcon fontSize="small" />
            <Typography variant="body2">
              Weight: {selectedProduct.weight || "N/A"} g
            </Typography>
          </Box>
        </Box>

        {/* أزرار الإجراء */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
            sx={{ mr: 2 }}
          >
            Close
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleAddToCart(selectedProduct)}
          >
            Add to Cart
          </Button>
        </Box>
      </>
    )}
  </Box>
</Fade>

      </Modal>
    </Box>
  );
};

export default Home;
