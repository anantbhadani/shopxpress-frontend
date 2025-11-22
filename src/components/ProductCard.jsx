import React, { useEffect, useState } from "react";
import { CircularProgress, Card, CardMedia, CardContent, Typography, Button, Grid, Chip, Box } from "@mui/material";
import useStore from "../store/useStore";
import { toast } from "react-toastify";
import ProductModal from "./ProductModal";
import SearchAndFilter from "./SearchAndFilter";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 10000,
    inStock: "",
  });
  const [sortBy, setSortBy] = useState("");
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice > 0) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice < 10000) params.append("maxPrice", filters.maxPrice);
      if (filters.inStock) params.append("inStock", filters.inStock);
      if (sortBy) params.append("sortBy", sortBy);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products?${params.toString()}`
      );
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleAddToCart = (id) => {
    addToCart(id);
    toast.success("Item added to cart!");
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const isNewProduct = (product) => {
    if (!product.createdAt) return false;
    const createdDate = product.createdAt?.toDate 
      ? product.createdAt.toDate() 
      : new Date(product.createdAt);
    const daysSinceCreation = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 7; // New if created within 7 days
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Products
      </Typography>

      {/* Search and Filter Component */}
      <SearchAndFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={50} />
        </Box>
      ) : products.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            No products found matching your criteria.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchQuery("");
              setFilters({ category: "", minPrice: 0, maxPrice: 10000, inStock: "" });
              setSortBy("");
            }}
            sx={{ mt: 2 }}
          >
            Clear Filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  maxWidth: 350,
                  borderRadius: "12px",
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleProductClick(product)}
              >
                {/* New Product Banner */}
                {isNewProduct(product) && (
                  <Chip
                    label="NEW"
                    color="error"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      zIndex: 1,
                      fontWeight: "bold",
                    }}
                  />
                )}

                {/* 🛠️ Improved Image Handling */}
                <CardMedia
                  component="img"
                  image={product.imageUrl ?? "../assets/bg-home.jpeg"}
                  alt={product.name}
                  sx={{
                    height: 180,
                    objectFit: "contain",
                    padding: "10px",
                    backgroundColor: "#f8f8f8",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {product.desc || product.description}
                  </Typography>
                  <Typography variant="body1" color="primary" sx={{ marginTop: "5px" }}>
                    ₹{product.price}
                  </Typography>
                  <Button
                    variant={product.quantity === 0 ? "contained" : "outlined"}
                    color={product.quantity === 0 ? "secondary" : "primary"}
                    fullWidth
                    sx={{ marginTop: "10px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                    disabled={product.quantity === 0}
                  >
                    {product.quantity === 0 ? "Sold Out" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Product Modal */}
      <ProductModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductCard;
