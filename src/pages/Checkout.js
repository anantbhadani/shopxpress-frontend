import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Divider,
  Alert,
} from "@mui/material";
import { CreditCard, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { auth } from "../firebase";
import useStore from "../store/useStore";

const API_URL = process.env.REACT_APP_API_URL || "https://shopxpress-backend.onrender.com/api";

const Checkout = () => {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  // Card payment states
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  });
  const [otp, setOtp] = useState("");
  const [testCardData, setTestCardData] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [showCVV, setShowCVV] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = 50;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const cleaned = value.replace(/\s/g, '');
      if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
        const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
        setCardDetails((prev) => ({ ...prev, [name]: formatted }));
      }
    }
    // Format expiry date (MM/YY)
    else if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 4) {
        let formatted = cleaned;
        if (cleaned.length >= 2) {
          formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        }
        setCardDetails((prev) => ({ ...prev, [name]: formatted }));
      }
    }
    // CVV - only 3 digits
    else if (name === "cvv") {
      if (value.length <= 3 && /^\d*$/.test(value)) {
        setCardDetails((prev) => ({ ...prev, [name]: value }));
      }
    }
    else {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Generate test card details when card payment is selected
  useEffect(() => {
    const generateTestCard = async () => {
      if (paymentMethod === "card" && !testCardData) {
        try {
          const user = auth.currentUser;
          if (!user) return;

          const token = await user.getIdToken();
          const response = await axios.post(
            `${API_URL}/payments/generate-test-card`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );

          if (response.data && response.data.cardDetails) {
            setTestCardData(response.data);
            setCardDetails({
              cardNumber: response.data.cardDetails.cardNumber,
              cardHolderName: response.data.cardDetails.cardHolderName,
              expiryDate: response.data.cardDetails.expiryDate,
              cvv: response.data.cardDetails.cvv,
            });
            
            toast.info(`Test OTP: ${response.data.otp} (Check server console for details)`);
          }
        } catch (error) {
          console.error("Error generating test card:", error);
          // Check if response is HTML (404 page) - this causes "Unexpected token '<'" error
          if (error.response && typeof error.response.data === 'string' && error.response.data.startsWith('<!')) {
            toast.error("Backend server not found. Please ensure backend is running on port 5000.");
          } else if (error.response?.status === 404 || error.response?.status === 500) {
            toast.warning("Payment API not available. Please enter card details manually.");
          } else if (!error.response) {
            // Network error or backend not running
            toast.error("Cannot connect to payment service. Please check if backend is running.");
          }
        }
      }
    };

    generateTestCard();
  }, [paymentMethod, testCardData]);

  // Reset card states when payment method changes
  useEffect(() => {
    if (paymentMethod !== "card") {
      setOtpVerified(false);
      setPaymentId(null);
      setOtp("");
      setTestCardData(null);
    }
  }, [paymentMethod]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login to continue.");
        navigate("/");
        return;
      }

      const token = await user.getIdToken();
      const response = await axios.post(
        `${API_URL}/payments/verify-otp`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setOtpVerified(true);
      setPaymentId(response.data.paymentId);
      toast.success("OTP verified successfully!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Check if response is HTML (404 page) - this causes "Unexpected token '<'" error
      if (error.response && typeof error.response.data === 'string' && error.response.data.startsWith('<!')) {
        toast.error("Backend server not found. Please ensure backend is running on port 5000.");
      } else if (!error.response) {
        toast.error("Cannot connect to payment service. Please check if backend is running.");
      } else {
        toast.error(error.response?.data?.message || "Failed to verify OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.phone) {
      toast.error("Please fill in all shipping address fields.");
      return;
    }

    // For card payment, verify OTP first
    if (paymentMethod === "card") {
      if (!otpVerified || !paymentId) {
        toast.error("Please verify OTP first before placing order.");
        return;
      }
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login to continue.");
        navigate("/");
        return;
      }

      const token = await user.getIdToken();

      // Payment processing
      let paymentStatus = "completed";
      let finalPaymentId = paymentId;

      if (paymentMethod === "card") {
        // Use the verified payment ID
        finalPaymentId = paymentId;
        paymentStatus = "completed";
      } else if (paymentMethod === "upi") {
        // For UPI, generate payment ID
        finalPaymentId = `PAY_UPI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        paymentStatus = "completed";
      } else {
        // Cash on Delivery
        finalPaymentId = null;
        paymentStatus = "pending";
      }

      const orderData = {
        shippingAddress,
        paymentMethod,
        paymentId: finalPaymentId,
        paymentStatus,
      };

      const response = await axios.post(
        `${API_URL}/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.order.status === "failed") {
        toast.error("Payment failed. Order not created. Please try again.");
        return;
      }

      toast.success("Order placed successfully!");
      
      // Clear cart
      useStore.getState().clearCart();
      
      // Navigate to order confirmation
      navigate(`/user-dashboard`);
    } catch (error) {
      console.error("Error placing order:", error);
      // Check if response is HTML (404 page) - this causes "Unexpected token '<'" error
      if (error.response && typeof error.response.data === 'string' && error.response.data.startsWith('<!')) {
        toast.error("Backend server not found. Please ensure backend is running on port 5000.");
      } else if (!error.response) {
        toast.error("Cannot connect to server. Please check if backend is running.");
      } else {
        const errorMessage = error.response?.data?.message || "Failed to place order.";
        toast.error(errorMessage);
      }
      
      // If order was created with failed status, show it
      if (error.response?.data?.order?.status === "failed") {
        toast.info("Order created with failed payment status. Check your order history.");
        navigate("/user-dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" style={{ marginTop: 100, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/products")}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: 100, marginBottom: 50 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Grid container spacing={3}>
        {/* Shipping Address */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              </Grid>

              <Box mt={3}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Payment Method</FormLabel>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
                    <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
                    <FormControlLabel value="upi" control={<Radio />} label="UPI" />
                  </RadioGroup>
                </FormControl>
              </Box>

              {/* Card Payment Details */}
              {paymentMethod === "card" && (
                <Box mt={3}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    <CreditCard sx={{ mr: 1, verticalAlign: "middle" }} />
                    Card Details
                  </Typography>
                  
                  {testCardData && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Test Mode:</strong> Card details auto-filled. 
                        OTP: <strong>{testCardData.otp}</strong> (Check server console)
                      </Typography>
                    </Alert>
                  )}

                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardInputChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        inputProps={{ maxLength: 19 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Holder Name"
                        name="cardHolderName"
                        value={cardDetails.cardHolderName}
                        onChange={handleCardInputChange}
                        placeholder="JOHN DOE"
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleCardInputChange}
                        placeholder="MM/YY"
                        required
                        inputProps={{ maxLength: 5 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        name="cvv"
                        type={showCVV ? "text" : "password"}
                        value={cardDetails.cvv}
                        onChange={handleCardInputChange}
                        placeholder="123"
                        required
                        inputProps={{ maxLength: 3 }}
                        InputProps={{
                          endAdornment: (
                            <Button
                              size="small"
                              onClick={() => setShowCVV(!showCVV)}
                              sx={{ minWidth: "auto", p: 0.5 }}
                            >
                              {showCVV ? <VisibilityOff /> : <Visibility />}
                            </Button>
                          ),
                        }}
                      />
                    </Grid>

                    {/* OTP Verification Section */}
                    {!otpVerified && (
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>
                          <Lock sx={{ mr: 1, verticalAlign: "middle", fontSize: 18 }} />
                          OTP Verification
                        </Typography>
                        <Box display="flex" gap={2} mt={1}>
                          <TextField
                            label="Enter OTP"
                            value={otp}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 6) {
                                setOtp(value);
                              }
                            }}
                            placeholder="123456"
                            inputProps={{ maxLength: 6 }}
                            sx={{ flex: 1 }}
                          />
                          <Button
                            variant="contained"
                            onClick={handleVerifyOTP}
                            disabled={loading || otp.length !== 6}
                          >
                            Verify OTP
                          </Button>
                        </Box>
                        {testCardData && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            Test OTP: <strong>{testCardData.otp}</strong>
                          </Typography>
                        )}
                      </Grid>
                    )}

                    {otpVerified && (
                      <Grid item xs={12}>
                        <Alert severity="success">
                          OTP verified successfully! Payment ID: {paymentId}
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box mt={2}>
                {cart.map((item) => (
                  <Box key={item.productId} display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      {item.name} x {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                <Box mt={2} pt={2} borderTop="1px solid #ddd">
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Subtotal:</Typography>
                    <Typography>₹{subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Tax (10%):</Typography>
                    <Typography>₹{tax.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Shipping:</Typography>
                    <Typography>₹{shipping.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mt={2} pt={2} borderTop="1px solid #ddd">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">₹{total.toFixed(2)}</Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handlePlaceOrder}
                  disabled={loading || (paymentMethod === "card" && !otpVerified)}
                  style={{ marginTop: 20 }}
                >
                  {loading ? <CircularProgress size={24} /> : paymentMethod === "card" && !otpVerified ? "Verify OTP First" : "Place Order"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;

