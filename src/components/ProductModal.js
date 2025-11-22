import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CardMedia,
  Grid,
  Rating,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { toast } from "react-toastify";
import useStore from "../store/useStore";
import axios from "axios";

const ProductModal = ({ open, onClose, product }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const addToCart = useStore((state) => state.addToCart);

  const loadReviews = useCallback(async () => {
    if (!product?.id) return;
    
    setLoadingReviews(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/${product.id}/reviews`
      );
      const reviewsData = response.data.reviews || [];
      setReviews(reviewsData);
      
      // Calculate average rating
      if (reviewsData.length > 0) {
        const sum = reviewsData.reduce((acc, review) => acc + (review.rating || 0), 0);
        setAverageRating(sum / reviewsData.length);
      } else {
      setAverageRating(0);
    }
  } catch (error) {
    console.error("Error loading reviews:", error);
    setReviews([]);
    setAverageRating(0);
  } finally {
    setLoadingReviews(false);
  }
}, [product?.id]);

  useEffect(() => {
    if (open && product) {
      loadReviews();
    }
  }, [open, product, loadReviews]);

  const handleAddToCart = () => {
    if (product.quantity === 0) {
      toast.error("Product is out of stock!");
      return;
    }
    addToCart(product.id);
    toast.success("Item added to cart!");
    onClose();
  };

  if (!product) return null;

  const isNewProduct = () => {
    if (!product.createdAt) return false;
    const createdDate = product.createdAt?.toDate 
      ? product.createdAt.toDate() 
      : new Date(product.createdAt);
    const daysSinceCreation = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 7; // New if created within 7 days
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{product.name}</Typography>
          {isNewProduct() && (
            <Chip
              label="NEW"
              color="error"
              size="small"
              style={{ fontWeight: "bold" }}
            />
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={product.imageUrl || "../assets/bg-home.jpeg"}
              alt={product.name}
              sx={{
                width: "100%",
                height: 300,
                objectFit: "contain",
                backgroundColor: "#f8f8f8",
                borderRadius: 2,
              }}
            />
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="h4" color="primary" gutterBottom>
                ₹{product.price}
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Rating value={averageRating} readOnly precision={0.5} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </Typography>
              </Box>
              <Chip
                label={product.quantity > 0 ? `In Stock (${product.quantity})` : "Out of Stock"}
                color={product.quantity > 0 ? "success" : "error"}
                size="small"
                sx={{ mb: 2 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Description */}
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {product.description || product.desc || "No description available."}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              sx={{ mt: 2 }}
            >
              {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </Grid>

          {/* Reviews Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Customer Reviews
            </Typography>
            {loadingReviews ? (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            ) : reviews.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No reviews yet. Be the first to review this product!
              </Typography>
            ) : (
              <Box>
                {reviews.map((review, index) => (
                  <Box key={index} mb={2} pb={2} borderBottom="1px solid #eee">
                    <Box display="flex" alignItems="center" mb={1}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {review.userName?.charAt(0)?.toUpperCase() || "U"}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {review.userName || "Anonymous"}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {review.createdAt?.toDate
                          ? new Date(review.createdAt.toDate()).toLocaleDateString()
                          : "Recently"}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {review.comment || "No comment provided."}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;

