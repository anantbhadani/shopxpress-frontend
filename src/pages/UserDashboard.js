import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Box,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Edit,
  Phone,
  Email,
  Person,
  ShoppingBag,
  CheckCircle,
  Pending,
  Cancel,
  LocalShipping,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "react-toastify/dist/ReactToastify.css";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        // Check if user is admin - redirect to admin page
        const userRole = localStorage.getItem("userRole");
        if (userRole === "admin") {
          navigate("/admin-dashboard");
          return;
        }
        await loadUserProfile(firebaseUser.uid);
        await loadOrders(firebaseUser.uid);
      } else {
        setIsAuthenticated(false);
        setLoading(false);
        // Don't redirect, show guest page instead
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadUserProfile = async (uid) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setUser(response.data.user);
      setFormData({
        name: response.data.user.name || "",
        email: response.data.user.email || "",
        mobile: response.data.user.mobile || "",
      });
      setImagePreview(response.data.user.profileImage || null);
    } catch (error) {
      console.error("Error loading profile:", error);
      // Fallback to localStorage data
      const storedUser = {
        name: localStorage.getItem("username") || "",
        email: localStorage.getItem("email") || "",
        mobile: "",
        profileImage: null,
      };
      setUser(storedUser);
      setFormData({
        name: storedUser.name,
        email: storedUser.email,
        mobile: storedUser.mobile,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (uid) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      const ordersData = response.data.orders || [];
      // Sort orders by date (newest first)
      ordersData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    }
  };

  // Real-time order status updates (polling every 30 seconds and on visibility change)
  useEffect(() => {
    if (!auth.currentUser) return;

    const pollOrders = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        const ordersData = response.data.orders || [];
        ordersData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        setOrders(ordersData);
      } catch (error) {
        console.error("Error polling orders:", error);
      }
    };

    // Poll immediately
    pollOrders();

    // Poll every 30 seconds
    const interval = setInterval(pollOrders, 30000);

    // Poll when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        pollOrders();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("mobile", formData.mobile);
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/profile`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Profile updated successfully!");
      setEditDialogOpen(false);
      await loadUserProfile(auth.currentUser.uid);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
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

  const filteredOrders = orders.filter((order) => {
    if (tabValue === 0) return true; // All orders
    if (tabValue === 1) return order.status === "pending" || order.status === "processing";
    if (tabValue === 2) return order.status === "delivered";
    if (tabValue === 3) return order.status === "cancelled" || order.status === "failed";
    return true;
  });

  // Refresh orders when tab changes or component becomes visible
  useEffect(() => {
    if (auth.currentUser) {
      loadOrders(auth.currentUser.uid);
    }
  }, [tabValue]);

  // Guest Dashboard View
  if (!isAuthenticated && !loading) {
    return (
      <Container maxWidth="lg" style={{ marginTop: 100, marginBottom: 50 }}>
        <Box textAlign="center" py={8}>
          <Person sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Welcome to ShopXpress
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
            Please log in to access your dashboard, view your order history, and manage your profile.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/")}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: 100, marginBottom: 50 }}>
      <Typography variant="h4" gutterBottom style={{ marginBottom: 30 }}>
        My Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                <Avatar
                  src={imagePreview}
                  sx={{ width: 120, height: 120, mb: 2 }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {user?.name || "User"}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditDialogOpen(true)}
                  size="small"
                >
                  Edit Profile
                </Button>
              </Box>

              <Box mt={3}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Email style={{ marginRight: 10, color: "#666" }} />
                  <Typography variant="body1">{user?.email || "N/A"}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Phone style={{ marginRight: 10, color: "#666" }} />
                  <Typography variant="body1">
                    {user?.mobile || "Not provided"}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Person style={{ marginRight: 10, color: "#666" }} />
                  <Typography variant="body2" color="textSecondary">
                    Member since {new Date().getFullYear()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Orders Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order History
              </Typography>

              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{ mb: 2 }}
              >
                <Tab label="All Orders" />
                <Tab label="Pending" />
                <Tab label="Delivered" />
                <Tab label="Failed/Cancelled" />
              </Tabs>

              {filteredOrders.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <ShoppingBag style={{ fontSize: 60, color: "#ccc", mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    No orders found
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/products")}
                    style={{ marginTop: 20 }}
                  >
                    Start Shopping
                  </Button>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.orderId || order.id.slice(0, 8)}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{order.items?.length || 0} items</TableCell>
                          <TableCell>₹{order.total?.toFixed(2) || "0.00"}</TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(order.status)}
                              label={order.status?.toUpperCase()}
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1}>
                              <Button
                                size="small"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                View
                              </Button>
                              {(order.status === "pending" || order.status === "processing") && (
                                <Button
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  onClick={async () => {
                                    if (window.confirm("Are you sure you want to cancel this order?")) {
                                      try {
                                        const token = await auth.currentUser?.getIdToken();
                                        await axios.post(
                                          `${process.env.REACT_APP_API_URL}/orders/${order.id}/cancel`,
                                          {},
                                          {
                                            headers: {
                                              Authorization: `Bearer ${token}`,
                                            },
                                            withCredentials: true,
                                          }
                                        );
                                        toast.success("Order cancelled successfully!");
                                        await loadOrders(auth.currentUser.uid);
                                      } catch (error) {
                                        console.error("Error cancelling order:", error);
                                        toast.error(error.response?.data?.message || "Failed to cancel order.");
                                      }
                                    }
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="profile-image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="profile-image-upload">
              <Button variant="outlined" component="span" fullWidth>
                Upload Profile Image
              </Button>
            </label>
            {imagePreview && (
              <Box mt={2} textAlign="center">
                <Avatar src={imagePreview} sx={{ width: 100, height: 100, mx: "auto" }} />
              </Box>
            )}
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={formData.email}
              disabled
            />
            <TextField
              fullWidth
              label="Mobile Number"
              margin="normal"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="+91 1234567890"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateProfile} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDashboard;

