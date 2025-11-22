import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Paper,
  Typography,
  Slider,
  Chip,
  IconButton,
} from "@mui/material";
import { Search, Clear, FilterList } from "@mui/icons-material";
import axios from "axios";

const SearchAndFilter = ({ onSearch, onFilterChange, onSortChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("");
  const [inStock, setInStock] = useState("");
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/categories`
      );
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setMinPrice(0);
    setMaxPrice(10000);
    setSortBy("");
    setInStock("");
    onSearch("");
    onFilterChange({ category: "", minPrice: 0, maxPrice: 10000, inStock: "" });
    onSortChange("");
  };

  const handleFilterChange = () => {
    onFilterChange({
      category,
      minPrice,
      maxPrice,
      inStock,
    });
  };

  useEffect(() => {
    handleFilterChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, minPrice, maxPrice, inStock]);

  useEffect(() => {
    onSortChange(sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const activeFiltersCount = [
    category,
    minPrice > 0,
    maxPrice < 10000,
    inStock,
    sortBy,
  ].filter(Boolean).length;

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {/* Search Bar */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                endAdornment: searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchQuery("");
                      onSearch("");
                    }}
                  >
                    <Clear />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" gap={1}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<Search />}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterList />}
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Filters Panel */}
      {showFilters && (
        <Box
          sx={{
            borderTop: "1px solid #e0e0e0",
            pt: 2,
            mt: 2,
          }}
        >
          <Grid container spacing={2}>
            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Price Range */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography gutterBottom>Price Range: ₹{minPrice} - ₹{maxPrice}</Typography>
              <Slider
                value={[minPrice, maxPrice]}
                onChange={(e, newValue) => {
                  setMinPrice(newValue[0]);
                  setMaxPrice(newValue[1]);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={100}
              />
            </Grid>

            {/* In Stock Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Stock</InputLabel>
                <Select
                  value={inStock}
                  label="Stock"
                  onChange={(e) => setInStock(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">In Stock</MenuItem>
                  <MenuItem value="false">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Sort By */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="">Default</MenuItem>
                  <MenuItem value="price_asc">Price: Low to High</MenuItem>
                  <MenuItem value="price_desc">Price: High to Low</MenuItem>
                  <MenuItem value="name_asc">Name: A to Z</MenuItem>
                  <MenuItem value="name_desc">Name: Z to A</MenuItem>
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Clear Filters */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearFilters}
                startIcon={<Clear />}
              >
                Clear All Filters
              </Button>
            </Grid>
          </Grid>

          {/* Active Filters Chips */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Typography variant="body2" sx={{ alignSelf: "center", mr: 1 }}>
                Active Filters:
              </Typography>
              {category && (
                <Chip
                  label={`Category: ${category}`}
                  onDelete={() => setCategory("")}
                  size="small"
                />
              )}
              {(minPrice > 0 || maxPrice < 10000) && (
                <Chip
                  label={`Price: ₹${minPrice} - ₹${maxPrice}`}
                  onDelete={() => {
                    setMinPrice(0);
                    setMaxPrice(10000);
                  }}
                  size="small"
                />
              )}
              {inStock && (
                <Chip
                  label={inStock === "true" ? "In Stock" : "Out of Stock"}
                  onDelete={() => setInStock("")}
                  size="small"
                />
              )}
              {sortBy && (
                <Chip
                  label={`Sort: ${sortBy.replace("_", " ")}`}
                  onDelete={() => setSortBy("")}
                  size="small"
                />
              )}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default SearchAndFilter;

