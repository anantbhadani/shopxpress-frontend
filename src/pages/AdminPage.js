import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  AppBar,
  Toolbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Divider,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Logout,
  AdminPanelSettings,
  ShoppingBag,
  Inventory,
  CreditCard,
  AccountBalanceWallet,
  Money,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { fetchProducts } from "../api/products";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify admin access
    const userRole = localStorage.getItem("userRole");
    const isAuth = localStorage.getItem("isAuthenticated");
    
    if (userRole !== "admin" || isAuth !== "true") {
      navigate("/admin-login");
      return;
    }

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("authToken", token);
        // Load products and orders after authentication is confirmed
        loadProducts();
        loadOrders();
      } else {
        // If user is not authenticated, redirect to login
        localStorage.clear();
        navigate("/admin-login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login again.");
        navigate("/admin-login");
        return;
      }

      const token = await user.getIdToken();
      await axios.put(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Order status updated successfully!");
      loadOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
    }
  };

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

  const getPaymentMethodDisplay = (paymentMethod) => {
    if (!paymentMethod) return "N/A";
    
    const method = paymentMethod.toLowerCase();
    switch (method) {
      case "cash":
      case "cash on delivery":
      case "cod":
        return {
          label: "Cash on Delivery",
          icon: <Money style={{ fontSize: 16, marginRight: 4 }} />,
          color: "default",
        };
      case "card":
      case "credit":
      case "debit":
        return {
          label: "Credit/Debit Card",
          icon: <CreditCard style={{ fontSize: 16, marginRight: 4 }} />,
          color: "primary",
        };
      case "upi":
        return {
          label: "UPI",
          icon: <AccountBalanceWallet style={{ fontSize: 16, marginRight: 4 }} />,
          color: "success",
        };
      default:
        return {
          label: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
          icon: <CreditCard style={{ fontSize: 16, marginRight: 4 }} />,
          color: "default",
        };
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        quantity: product.quantity || "",
        image: null,
      });
      setImagePreview(product.imageUrl || null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        description: "",
        quantity: "",
        image: null,
      });
      setImagePreview(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      quantity: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      // Get token from Firebase auth
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login again.");
        navigate("/admin-login");
        return;
      }
      const token = await user.getIdToken();

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("quantity", formData.quantity);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      if (editingProduct) {
        // Update product
        await axios.put(
          `${process.env.REACT_APP_API_URL}/products/update/${editingProduct.id}`,
          formDataToSend,
          config
        );
        toast.success("Product updated successfully!");
      } else {
        // Add new product
        await axios.post(
          `${process.env.REACT_APP_API_URL}/products/add`,
          formDataToSend,
          config
        );
        toast.success("Product added successfully!");
      }

      handleCloseDialog();
      loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(
        error.response?.data?.error || "Failed to save product."
      );
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      // Get token from Firebase auth
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login again.");
        navigate("/admin-login");
        return;
      }
      const token = await user.getIdToken();
      
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/products/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success("Product deleted successfully!");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <AdminPanelSettings style={{ marginRight: 10 }} />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{ marginTop: 30, marginBottom: 30 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab icon={<Inventory />} label="Products" />
          <Tab icon={<ShoppingBag />} label="Orders" />
        </Tabs>

        {/* Products Tab */}
        {tabValue === 0 && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={3}
            >
              <Typography variant="h4">Product Management</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
              >
                Add Product
              </Button>
            </Box>

        {products.length === 0 ? (
          <Alert severity="info">No products found. Add your first product!</Alert>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl || "../assets/bg-home.jpeg"}
                    alt={product.name}
                    style={{ objectFit: "contain", padding: 10 }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ₹{product.price}
                    </Typography>
                    <Typography variant="body2">
                      Stock: {product.quantity}
                    </Typography>
                    <Box marginTop={2} display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleOpenDialog(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Product Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <Box marginTop={2}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span" fullWidth>
                    {editingProduct && !formData.image
                      ? "Change Image"
                      : "Upload Image"}
                  </Button>
                </label>
                {imagePreview && (
                  <Box marginTop={2}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={
                !formData.name ||
                !formData.price ||
                !formData.description ||
                !formData.quantity ||
                (!formData.image && !editingProduct)
              }
            >
              {editingProduct ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
          </>
        )}

        {/* Orders Tab */}
        {tabValue === 1 && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={3}
            >
              <Typography variant="h4">Order Management</Typography>
              <Button
                variant="outlined"
                onClick={loadOrders}
                disabled={ordersLoading}
              >
                Refresh
              </Button>
            </Box>

            {ordersLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : orders.length === 0 ? (
              <Alert severity="info">No orders found.</Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Update Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenOrderDialog(true);
                            }}
                            style={{ textTransform: "none" }}
                          >
                            #{order.orderId || order.id.slice(0, 8)}
                          </Button>
                        </TableCell>
                        <TableCell>{order.shippingAddress?.fullName || "N/A"}</TableCell>
                        <TableCell>
                          {order.createdAt?.toDate
                            ? new Date(order.createdAt.toDate()).toLocaleDateString()
                            : new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{order.items?.length || 0} items</TableCell>
                        <TableCell>₹{order.total?.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>
                          {(() => {
                            const paymentInfo = getPaymentMethodDisplay(order.paymentMethod);
                            return (
                              <Chip
                                icon={paymentInfo.icon}
                                label={paymentInfo.label}
                                color={paymentInfo.color}
                                size="small"
                                variant="outlined"
                              />
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status?.toUpperCase()}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" style={{ minWidth: 150 }}>
                            <Select
                              value={order.status || "pending"}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              disabled={order.status === "cancelled"}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="processing">Processing</MenuItem>
                              <MenuItem value="shipped">Shipped</MenuItem>
                              <MenuItem value="delivered">Delivered</MenuItem>
                              {order.status === "cancelled" && (
                                <MenuItem value="cancelled" disabled>
                                  Cancelled
                                </MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {/* Order Details Dialog */}
        <Dialog
          open={openOrderDialog}
          onClose={() => {
            setOpenOrderDialog(false);
            setSelectedOrder(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <Box>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Order ID
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      #{selectedOrder.orderId || selectedOrder.id.slice(0, 8)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Order Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedOrder.createdAt?.toDate
                        ? new Date(selectedOrder.createdAt.toDate()).toLocaleString()
                        : new Date(selectedOrder.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Customer Name
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedOrder.shippingAddress?.fullName || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedOrder.shippingAddress?.phone || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Shipping Address
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedOrder.shippingAddress
                        ? `${selectedOrder.shippingAddress.address}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} - ${selectedOrder.shippingAddress.zipCode}`
                        : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Payment Method
                    </Typography>
                    <Box mt={1}>
                      {(() => {
                        const paymentInfo = getPaymentMethodDisplay(selectedOrder.paymentMethod);
                        return (
                          <Chip
                            icon={paymentInfo.icon}
                            label={paymentInfo.label}
                            color={paymentInfo.color}
                            size="medium"
                            variant="outlined"
                          />
                        );
                      })()}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Payment ID
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedOrder.paymentId || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Order Items
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Subtotal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items?.map((item, index) => (
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
                    <Typography variant="body1">₹{selectedOrder.subtotal?.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Tax (10%)
                    </Typography>
                    <Typography variant="body1">₹{selectedOrder.tax?.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Shipping
                    </Typography>
                    <Typography variant="body1">₹{selectedOrder.shipping?.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" color="primary">
                      Total: ₹{selectedOrder.total?.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Status
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        label={selectedOrder.status?.toUpperCase()}
                        color={getStatusColor(selectedOrder.status)}
                        size="medium"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenOrderDialog(false);
              setSelectedOrder(null);
            }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default AdminPage;

