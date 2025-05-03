import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  TextField,
  Button,
  Tooltip,
  Modal,
  Fade,
  Backdrop,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import LayersIcon from '@mui/icons-material/Layers';
import ScaleIcon from '@mui/icons-material/Scale';
import { getProductById,createOrder } from '../utils/apiService';
import { toast } from 'react-toastify';
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
  width: '90%',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  
};

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [product, setProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?._id;
  const[openModalForOrder,setOpenModalForOrder]=useState(false);
  const fetchProduct = async () => {
    try {
      const response = await getProductById(item.product._id);
      setProduct(response);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleQuantityChange = (e) => {
    const newQty = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(newQty);
    console.log('the new quantity is ',newQty);
    console.log('the product is',product);
    console.log('the item is :',item);
    onQuantityChange(product._id, newQty);
  };

  const handleSubmitOrder = async () => {
    console.log(product._id);
    try {
      const orderData = {
        user: userId, 
        products: [{
          product: product._id,
          quantity: quantity,
        }],
        totalAmount: quantity * item.product.price,
        shippingAddress: {
          street,
          city,
          state,
          postalCode,
          country,
        },
        paymentMethod,
      };
      console.log(orderData);
      const res = await createOrder(
       orderData
      );
      console.log(res);
      if(res.status===200 || res.status ===201){
         toast.success("The order is done");
      }else if(res.status===400) {
           toast.error(" Insufficient stock for product");
      }
      else{
        throw new Error('Failed to submit order');
      }
      handleCloseOrder();
    } catch (err) {
     
      console.error('Order error:', err);
      toast.error(" Insufficient stock for product");
      handleCloseOrder();
    }
  };
  
  const handleCloseOrder=()=>setOpenModalForOrder(false);
  const handleCloseModal = () => setOpenModal(false);
  const isFormValid = () =>
    street && city && state && postalCode && country && paymentMethod;
  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 260,
          borderRadius: 3,
          boxShadow: 3,
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={item.product.image}
          alt={item.product.name}
          sx={{ objectFit: 'cover' }}
        />

        <CardContent>
          <Typography variant="h6" noWrap>
            {item.product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ${item.product.price}
          </Typography>

          <Box display="flex" alignItems="center" mt={2} gap={1}>
            <TextField
              type="number"
              label="الكمية"
              size="small"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1 }}
              sx={{ width: 80 }}
            />

            <Tooltip title="عرض التفاصيل">
              <IconButton color="primary" onClick={() => setOpenModal(true)}>
                <InfoIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="إزالة من السلة">
              <IconButton color="error" onClick={() => onRemove(item._id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Button
            variant="outlined"
            fullWidth
            color="success"
            sx={{ mt: 2 }}
            onClick={() => setOpenModalForOrder(true)}
          >
            order Now
          </Button>
        </CardContent>
      </Card>

      <Modal
  open={openModalForOrder}
  onClose={handleCloseOrder}
  closeAfterTransition
  BackdropComponent={Backdrop}
  BackdropProps={{ timeout: 500 }}
>
  <Fade in={openModalForOrder}>
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
    }}>
      {product ? (
        <>
          {/* زر الإغلاق */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleCloseOrder}
              size="small"
              color="error"
              variant="outlined"
            >
              Close
            </Button>
          </Box>

          <Typography variant="h5" mb={2} textAlign="center">Order Product</Typography>

          {/* الفورم */}
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Street"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="State"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Postal Code"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                SelectProps={{ native: true }}
              >
                
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
              </TextField>
            </Grid>
          </Grid>

          {/* زر الإرسال */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmitOrder}
              disabled={!isFormValid()}
            >
              Submit Order
            </Button>
          </Box>
        </>
      ) : (
        <Typography>Loading product info...</Typography>
      )}
    </Box>
  </Fade>
</Modal>


      {/* Modal لعرض التفاصيل وطلب المنتج */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
  <Box sx={modalStyle}>
    {product && (
      <>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
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
          <Typography variant="h5">{product.name}</Typography>
          <Typography variant="h6" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
        </Box>

        {/* الوصف */}
        <Typography variant="body1" sx={{ mb: 3 }}>
          {product.description || "No description available."}
        </Typography>

        {/* بيانات إضافية */}
        <Box mt={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CategoryIcon fontSize="small" />
            <Typography variant="body2">
              {product.category?.name || "Uncategorized"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <InventoryIcon fontSize="small" />
            <Typography variant="body2">
              Stock: {product.stock}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LayersIcon fontSize="small" />
            <Typography variant="body2">
              Material: {product.material || "N/A"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <ScaleIcon fontSize="small" />
            <Typography variant="body2">
              Weight: {product.weight || "N/A"} g
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
        </Box>
      </>
    )}
  </Box>
</Fade>
      </Modal>
    </>
  );
};

export default CartItem;
