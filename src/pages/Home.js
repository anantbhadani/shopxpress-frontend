import React from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to ShopXpress</h1>
        <p>Your one-stop shop for all your needs</p>
        <button className="start-shopping">Start Shopping</button>
      </motion.section>

      {/* Scroll Effect Content */}
      <motion.div
        className="scroll-effect"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2>Welcome to Our Store</h2>
      </motion.div>

      {/* Product Listing */}
      <ProductCard />
    </>
  );
};

export default Home;