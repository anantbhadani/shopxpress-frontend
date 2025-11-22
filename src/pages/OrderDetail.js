import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { ArrowBack, CheckCircle, Pending, Cancel, LocalShipping } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { auth } from "../firebase";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/");
        return;
      }

      const token = await user.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setOrder(response.data.order);
    } catch (error) {
      console.error("Error loading order:", error);
      toast.error("Failed to load order details.");
      navigate("/user-dashboard");
    } finally {
      setLoading(false);
    }
  }, [orderId, navigate]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle />;
      case "pending":
      case "processing":
        return <Pending />;
      case "shipped":
        return <LocalShipping />;
      case "cancelled":
      case "failed":
        return <Cancel />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" style={{ marginTop: 100 }}>
        <Typography variant="h5">Order not found</Typography>
        <Button onClick={() => navigate("/dashboard")} startIcon={<ArrowBack />}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: 100, marginBottom: 50 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/dashboard")}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Order Details</Typography>
            <Chip
              icon={getStatusIcon(order.status)}
              label={order.status?.toUpperCase()}
              color={getStatusColor(order.status)}
              size="medium"
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Order ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                #{order.orderId || order.id.slice(0, 8)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Order Date
              </Typography>
              <Typography variant="body1" gutterBottom>
                {order.createdAt?.toDate
                  ? new Date(order.createdAt.toDate()).toLocaleString()
                  : new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress?.fullName}
                <br />
                {order.shippingAddress?.address}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
                <br />
                Phone: {order.shippingAddress?.phone}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.price?.toFixed(2)}</TableCell>
                        <TableCell>₹{item.subtotal?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Subtotal
              </Typography>
              <Typography variant="body1">₹{order.subtotal?.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Tax (10%)
              </Typography>
              <Typography variant="body1">₹{order.tax?.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Shipping
              </Typography>
              <Typography variant="body1">₹{order.shipping?.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" color="primary">
                Total: ₹{order.total?.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OrderDetail;

