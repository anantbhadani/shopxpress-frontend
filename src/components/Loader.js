import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="body1" style={{ marginTop: 20, color: "#666" }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default Loader;