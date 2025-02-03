import React, { useEffect, useState } from "react";
import { CircularProgress, Card, CardMedia, CardContent, Typography, Button, Grid } from "@mui/material";
import { fetchProducts } from "../api/products.js";
import useStore from "../store/useStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useStore((state) => state.addToCart);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleAddToCart = (id) => {
    addToCart(id, email);
    toast.success("Item added to cart!");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Products
      </Typography>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <CircularProgress size={50} />
        </div>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    maxWidth: 350,
                    maxHeight: 350,
                    borderRadius: "12px",
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* 🛠️ Improved Image Handling */}
                  <CardMedia
                    component="img"
                    image={product.imageUrl ?? "../assets/bg-home.jpeg"}
                    alt={product.name}
                    sx={{
                      height: 180, // Keeps image height fixed
                      objectFit: "contain", // Ensures full image is visible without cropping
                      padding: "10px", // Adds spacing around the image
                      backgroundColor: "#f8f8f8", // Light background to enhance visibility
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.desc}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ marginTop: "5px" }}>
                      ₹{product.price}
                    </Typography>
                    <Button
                      variant={product.quantity === 0 ? "contained" : "outlined"}
                      color={product.quantity === 0 ? "secondary" : "primary"}
                      fullWidth
                      sx={{ marginTop: "10px" }}
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.quantity === 0}
                    >
                      {product.quantity === 0 ? "Sold Out" : "Add to Cart"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" align="center">
              No products available
            </Typography>
          )}
        </Grid>
      )}
    </div>
  );
};

export default ProductCard;
