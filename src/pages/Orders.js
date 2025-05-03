import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Divider,
  Avatar, Stack, CardMedia, Button
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaidIcon from '@mui/icons-material/Paid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PrintIcon from '@mui/icons-material/Print';
import {getUserOrders} from "../utils/apiService";
import jsPDF from 'jspdf';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders(); // ✅ انتظر نتيجة الـ API
        setOrders(response.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchOrders(); // ✅ شغل الدالة
  }, []);
   console.log('order is ',orders);
  const handlePrint = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Order ID: ${order._id}`, 10, 10);
    doc.text(`Payment Method: ${order.paymentMethod}`, 10, 20);
    doc.text(`Total: $${order.totalAmount.toFixed(2)}`, 10, 30);

    doc.setFontSize(14);
    doc.text('Products:', 10, 45);
    order.products.forEach((p, i) => {
      doc.setFontSize(12);
      doc.text(
        `${i + 1}. ${p.product.name} - $${p.product.price.toFixed(2)} x ${p.quantity} = $${(p.product.price * p.quantity).toFixed(2)}`,
        10,
        55 + i * 10
      );
    });

    const yOffset = 55 + order.products.length * 10 + 10;
    doc.setFontSize(14);
    doc.text('Shipping Address:', 10, yOffset);
    doc.setFontSize(12);
    doc.text(
      `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}`,
      10,
      yOffset + 10
    );
    doc.text(
      `${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`,
      10,
      yOffset + 20
    );

    doc.save(`order_${order._id}.pdf`);
  };

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Typography variant="h4" mb={4} fontWeight="bold">Your Orders</Typography>

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order._id} sx={{ mb: 4, p: 2, width: '100%', boxShadow: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar sx={{ bgcolor: '#1976d2' }}>
                    <ShoppingCartIcon />
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h6">Order ID: {order._id}</Typography>
                  <Typography color="text.secondary">
                    Payment: {order.paymentMethod.toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6" color="green">
                    ${order.totalAmount.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                <PaidIcon fontSize="small" sx={{ mr: 1 }} />
                Products:
              </Typography>

              <Stack spacing={2}>
                {order.products.map((item, index) => (
                  <Card key={index} sx={{ display: 'flex', p: 1, borderRadius: 2, boxShadow: 1 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                      image={item.product.image || '/placeholder.jpg'}
                      alt={item.product.name}
                    />
                    <Box sx={{ ml: 2, flexGrow: 1 }}>
                      <Typography variant="subtitle1">{item.product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Price: ${item.product.price.toFixed(2)} × {item.quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} />
                Shipping Address:
              </Typography>

              <Typography sx={{ pl: 4 }}>
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state},<br />
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </Typography>

              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={() => handlePrint(order)}
                >
                  Print PDF
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Orders;
