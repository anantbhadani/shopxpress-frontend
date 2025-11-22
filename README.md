# ShopXpress Frontend Application

A modern, responsive single-page application (SPA) built with React for the ShopXpress e-commerce platform. This frontend provides a comprehensive user interface for customers to browse products, manage shopping carts, place orders, and track their purchase history, along with a dedicated admin interface for managing products and orders.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Configuration](#configuration)
- [Application Routes](#application-routes)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Authentication Flow](#authentication-flow)
- [User Interface Features](#user-interface-features)
- [Performance Optimizations](#performance-optimizations)
- [Deployment](#deployment)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)

## Overview

The ShopXpress frontend is a React-based application that provides a seamless shopping experience. It features role-based access control, real-time cart synchronization, advanced product search and filtering, secure payment processing, and comprehensive order management. The application is built with modern web technologies and follows best practices for performance, security, and user experience.

### Key Capabilities

- User authentication and authorization with Firebase
- Product browsing with advanced search and filtering
- Shopping cart management with real-time synchronization
- Secure checkout process with multiple payment methods
- Order tracking and management
- User profile and dashboard
- Admin interface for product and order management
- Responsive design for all device types
- Optimized performance with lazy loading and code splitting

## Technology Stack

### Core Framework

- **React 19.0.0** - UI library and component framework
- **React DOM 19.0.0** - DOM rendering
- **React Router DOM 7.1.3** - Client-side routing and navigation

### UI Libraries and Styling

- **Material-UI (MUI) 6.4.1** - Component library and design system
- **Styled Components 6.1.14** - CSS-in-JS styling solution
- **Bootstrap 5.3.3** - Utility-first CSS framework
- **Tailwind CSS 4.0.0** - Utility-first CSS framework
- **Framer Motion 12.0.6** - Animation library

### State Management and Data

- **Zustand 5.0.3** - Lightweight state management
- **React Context API** - Authentication state management
- **Axios 1.7.9** - HTTP client for API requests

### Authentication and Backend

- **Firebase 11.2.0** - Authentication and analytics
- **React Hook Form 7.54.2** - Form handling and validation

### Utilities

- **React Toastify 11.0.3** - Toast notification system
- **React Icons 5.4.0** - Icon library
- **Dotenv 16.4.7** - Environment variable management

### Build Tools

- **React Scripts 5.0.1** - Create React App build configuration
- **PostCSS 8.5.1** - CSS processing
- **Autoprefixer 10.4.20** - CSS vendor prefixing

## Features

### User Features

#### Authentication and Authorization

- User registration with email validation
- Secure login with Firebase Authentication
- JWT token-based session management
- Role-based access control (User/Admin)
- Automatic token refresh
- Session persistence across page reloads
- Secure logout functionality

#### Product Browsing

- Product catalog with grid layout
- Advanced search functionality (full-text search by name and description)
- Category filtering
- Price range filtering with interactive slider
- Stock status filtering (In Stock/Out of Stock)
- Multiple sorting options:
  - Price: Low to High / High to Low
  - Name: A to Z / Z to A
  - Date: Newest First / Oldest First
  - Rating: Highest Rated
- Active filter display with chip removal
- Real-time search results
- Product detail modal with:
  - Large product image view
  - Full product description
  - Customer reviews and ratings
  - Average rating display
  - Add to cart functionality
- "Newly Added" badge for products created within 7 days

#### Shopping Cart

- Add items to cart
- Remove items from cart
- Update item quantities
- Persistent cart across sessions
- Real-time cart synchronization with backend
- Cart total calculation with tax and shipping
- Clear entire cart
- Cart item count badge in navbar
- Guest cart protection with login prompt

#### Checkout Process

- Shipping address form with validation
- Multiple payment methods:
  - Cash on Delivery (COD)
  - Credit/Debit Card (with OTP verification)
  - UPI
- Card payment flow:
  - Auto-generated test card details
  - Card details form (Card Number, Holder Name, Expiry, CVV)
  - OTP verification step
  - Secure payment processing
- Order summary with itemized breakdown
- Tax and shipping calculation
- Order confirmation

#### User Dashboard

- User profile information display:
  - Profile image
  - Name, email, mobile number
  - Account creation date
- Profile editing functionality
- Profile image upload
- Comprehensive order history with filtering:
  - All Orders
  - Pending Orders
  - Delivered Orders
  - Failed/Cancelled Orders
- Order status tracking with color-coded indicators
- Order detail view
- Cancel order functionality (for pending/processing orders)
- Real-time order status updates (auto-refresh every 30 seconds)
- Guest mode for non-authenticated users

#### Order Management

- View order history
- Order detail page with complete information:
  - Order items with quantities and prices
  - Shipping address
  - Payment method and payment ID
  - Order status
  - Order date and time
- Order cancellation with confirmation dialog
- Order status updates in real-time

### Admin Features

#### Admin Dashboard

- Protected admin routes
- Role-based access verification
- Product management:
  - Add new products with image upload
  - Update existing products
  - Delete products
  - View all products in table format
- Order management:
  - View all orders from all users
  - Order status management (Pending, Processing, Shipped, Delivered, Cancelled)
  - Order detail dialog with complete information
  - Payment method display (UPI, Card, Cash on Delivery)
  - Payment ID tracking
- Real-time order updates
- Refresh functionality

### User Interface Features

#### Navigation

- Fixed navbar with scroll-based transparency
- 50% transparency with blur effect when scrolling
- Smooth transitions and animations
- Responsive navigation for mobile devices
- Role-based navbar visibility (hidden for admins)
- Cart icon with item count badge
- User profile dropdown menu

#### Loading States

- Loading spinners for async operations
- Skeleton loaders for content
- Lazy loading with React.lazy and Suspense
- Initial loading state management
- Error boundaries for graceful error handling

#### Notifications

- Toast notifications for user actions
- Success, error, warning, and info messages
- Auto-dismiss functionality
- Positioned notifications

#### Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Adaptive component sizing
- Touch-friendly interactions
- Optimized for tablets and desktops

#### Accessibility

- Semantic HTML elements
- ARIA labels for icons
- Keyboard navigation support
- Screen reader compatibility

## Project Structure

```
shopxpress-frontend/
├── public/                 # Static files
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/               # API service functions
│   │   └── products.js
│   ├── assets/            # Images and static assets
│   │   ├── bg-home.jpeg
│   │   └── Logo.jpg
│   ├── components/        # Reusable React components
│   │   ├── AuthForm.jsx
│   │   ├── ErrorBoundary.js
│   │   ├── Loader.js
│   │   ├── ProductCard.jsx
│   │   ├── ProductModal.js
│   │   ├── ProtectedAdminRoute.js
│   │   ├── ProtectedUserRoute.js
│   │   └── SearchAndFilter.js
│   ├── context/           # React Context providers
│   │   └── AuthContext.js
│   ├── pages/            # Page components
│   │   ├── AdminLogin.js
│   │   ├── AdminPage.js
│   │   ├── Cart.js
│   │   ├── Checkout.js
│   │   ├── Home.js
│   │   ├── OrderDetail.js
│   │   ├── Profile.js
│   │   └── UserDashboard.js
│   ├── store/            # State management
│   │   └── useStore.js
│   ├── styles/           # CSS files
│   │   ├── app.css
│   │   ├── index.css
│   │   └── pullToRefresh.css
│   ├── App.js            # Main App component
│   ├── AppRouter.js      # Route configuration
│   ├── firebase.js       # Firebase client configuration
│   ├── index.js          # Application entry point
│   └── NotFoundPage.js  # 404 page component
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables (not in git)
```

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase project with Authentication enabled
- Backend API server running (or deployed)

### Step 1: Install Dependencies

```bash
# Navigate to frontend directory
cd shopxpress-frontend

# Install all dependencies
npm install
```

### Step 2: Environment Configuration

Create a `.env` file in the `shopxpress-frontend/` directory:

**For Production (Deployed Backend):**
```env
REACT_APP_API_URL=https://shopxpress-backend.onrender.com/api
```

**For Development (Local Backend):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Note:** The backend is currently deployed at `https://shopxpress-backend.onrender.com`. Use the production URL unless you're running the backend locally.

### Step 3: Firebase Configuration

Update `src/firebase.js` with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Step 4: Start Development Server

```bash
# Start the development server
npm start
```

The application will be available at `http://localhost:3000`

### Step 5: Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
# or
npm run serve
```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_API_URL` | Backend API base URL | Yes | `https://shopxpress-backend.onrender.com/api` |

**Current Production Backend URL:** `https://shopxpress-backend.onrender.com/api`

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password provider)
3. Get your Firebase configuration from Project Settings
4. Update `src/firebase.js` with your configuration

### API Configuration

The frontend communicates with the backend API. Ensure:

1. Backend server is running (development) or deployed (production)
2. CORS is properly configured on the backend
3. `REACT_APP_API_URL` points to the correct backend URL
4. Backend API endpoints are accessible

## Application Routes

### Public Routes

- `/` - Home page (redirects to login if not authenticated)
- `/login` - User login and registration page
- `/admin-login` - Admin login page

### Protected User Routes

These routes require authentication and are only accessible to regular users (not admins):

- `/` - Home page (when authenticated)
- `/products` - Product listing with search and filters
- `/cart` - Shopping cart management
- `/checkout` - Order checkout and payment
- `/user-dashboard` - User dashboard and profile
- `/dashboard` - Alias for user dashboard
- `/orders/:orderId` - Order detail page

### Protected Admin Routes

These routes require admin authentication:

- `/admin-dashboard` - Admin dashboard for product and order management

### Route Protection

- **ProtectedUserRoute**: Prevents admin users from accessing user routes, redirects to admin dashboard
- **ProtectedAdminRoute**: Prevents non-admin users from accessing admin routes, redirects to admin login
- **Authentication Check**: All protected routes verify Firebase authentication state

## Component Architecture

### Page Components

#### Home (`pages/Home.js`)
Landing page for authenticated users. Displays welcome content and navigation options.

#### Products (`components/ProductCard.jsx`)
Product listing page with:
- Product grid display
- Search and filter integration
- Product modal integration
- "Newly Added" badge display
- Add to cart functionality

#### Cart (`pages/Cart.js`)
Shopping cart management page with:
- Cart item display
- Quantity updates
- Item removal
- Total calculation
- Checkout button
- Login prompt for guests

#### Checkout (`pages/Checkout.js`)
Order checkout page with:
- Shipping address form
- Payment method selection
- Card payment form (when card selected)
- OTP verification
- Order summary
- Order placement

#### UserDashboard (`pages/UserDashboard.js`)
User profile and order management page with:
- Profile information display and editing
- Order history with filtering
- Order status tracking
- Order cancellation
- Guest mode view

#### AdminPage (`pages/AdminPage.js`)
Admin dashboard with:
- Product management (Add, Update, Delete)
- Order management (View all, Update status)
- Order detail dialog
- Payment information display

### Reusable Components

#### AuthForm (`components/AuthForm.jsx`)
Authentication form component with:
- Login and registration modes
- Form validation
- Firebase authentication integration
- Error handling
- Loading states

#### ProductModal (`components/ProductModal.js`)
Product detail modal with:
- Large product image
- Product description
- Reviews and ratings display
- Add to cart button

#### SearchAndFilter (`components/SearchAndFilter.js`)
Search and filtering component with:
- Search input
- Category dropdown
- Price range slider
- Stock status filter
- Sort options
- Active filter chips
- Clear filters functionality

#### ProtectedAdminRoute (`components/ProtectedAdminRoute.js`)
Route protection component for admin routes:
- Firebase authentication check
- Admin role verification
- Loading state during verification
- Redirect to admin login if unauthorized

#### ProtectedUserRoute (`components/ProtectedUserRoute.js`)
Route protection component for user routes:
- Admin user detection and redirect
- User authentication check
- Prevents admin access to user routes

#### Loader (`components/Loader.js`)
Loading spinner component for async operations and route transitions.

#### ErrorBoundary (`components/ErrorBoundary.js`)
Error boundary component for graceful error handling and user feedback.

## State Management

### Zustand Store

Global state management using Zustand for:

- **Cart State**: Cart items, loading state, error state
- **Cart Operations**: 
  - `fetchCart()` - Fetch cart from backend
  - `addToCart(productId)` - Add item to cart
  - `removeFromCart(productId)` - Remove item from cart
  - `clearCart()` - Clear entire cart

Cart state is synchronized with:
- Backend Firestore database
- LocalStorage for persistence
- Real-time updates

### React Context

Authentication state management using React Context:

- **AuthContext**: Provides authentication state and functions
- **State**: `isAuthenticated`, `userId`, `userRole`, `isAdmin`
- **Functions**: `login()`, `logout()`

### LocalStorage

Persistent storage for:
- User authentication state
- User profile information
- User role
- Cart items (backup)

## Authentication Flow

### User Login Flow

1. User enters email and password on login page
2. Frontend authenticates with Firebase using `signInWithEmailAndPassword`
3. Firebase returns user credential and token
4. Frontend calls backend API `/api/users/login` with token
5. Backend verifies token and returns user data including role
6. Frontend stores user data in localStorage
7. `onAuthStateChanged` listener in App.js sets `isAuthenticated` to true
8. User is redirected based on role:
   - Regular user → `/` (Home page)
   - Admin user → `/admin-dashboard`

### User Registration Flow

1. User enters name, email, and password
2. Frontend calls backend API `/api/users/signup`
3. Backend creates user in Firebase and Firestore
4. Frontend creates Firebase account using `createUserWithEmailAndPassword`
5. User is prompted to login

### Admin Login Flow

1. Admin enters credentials on `/admin-login` page
2. Frontend authenticates with Firebase
3. Frontend calls backend API to verify admin role
4. If admin role confirmed, admin data stored in localStorage
5. Admin redirected to `/admin-dashboard`
6. If not admin, user is signed out and shown error

### Session Management

- Firebase `onAuthStateChanged` listener monitors authentication state
- Token automatically refreshed by Firebase
- Session persists across page reloads
- Logout clears all authentication data

## User Interface Features

### Dynamic Navbar

- Fixed position at top of page
- Scroll-based transparency (50% opacity when scrolled)
- Backdrop blur effect when transparent
- Smooth transitions
- Role-based visibility (hidden for admins and on admin routes)
- Cart icon with item count badge
- User profile dropdown

### Product Display

- Responsive grid layout
- Product cards with:
  - Product image
  - Product name and price
  - "Newly Added" badge (for products < 7 days old)
  - Quick view on click (opens modal)
- Product modal with:
  - Large image view
  - Full description
  - Reviews and ratings
  - Add to cart button

### Search and Filtering

- Real-time search as you type
- Category filter dropdown
- Price range slider (0 to 10,000)
- Stock status toggle
- Sort options dropdown
- Active filter chips with remove option
- Clear all filters button
- Filter count indicator

### Shopping Cart

- Cart icon in navbar with item count
- Cart page with:
  - Itemized list
  - Quantity controls
  - Remove item button
  - Subtotal, tax, shipping, and total
  - Checkout button
- Guest cart protection (login prompt)

### Checkout Process

- Multi-step checkout form
- Shipping address fields with validation
- Payment method selection:
  - Cash on Delivery
  - Credit/Debit Card
  - UPI
- Card payment form (conditional):
  - Card number (auto-formatted)
  - Card holder name
  - Expiry date (MM/YY format)
  - CVV (masked input)
  - OTP verification
- Order summary sidebar
- Place order button (disabled until payment verified for cards)

### User Dashboard

- Profile section:
  - Profile image with upload
  - Editable name, email, mobile
  - Account creation date
- Order history:
  - Tabbed interface (All, Pending, Delivered, Failed/Cancelled)
  - Order cards with status indicators
  - Order detail view
  - Cancel order button (for eligible orders)
- Real-time updates (polls every 30 seconds)
- Guest mode view for non-authenticated users

### Admin Dashboard

- Tabbed interface (Products, Orders)
- Products tab:
  - Product table with actions
  - Add product form
  - Edit product dialog
  - Delete confirmation
- Orders tab:
  - All orders table
  - Status update dropdown
  - Order detail dialog
  - Payment information display
  - Refresh button

## Performance Optimizations

### Code Splitting

- React.lazy() for route-based code splitting
- Suspense boundaries for loading states
- Reduced initial bundle size
- Faster initial page load

### Lazy Loading

- Components loaded on-demand
- Images loaded as needed
- Reduced memory usage
- Improved performance on low-end devices

### State Optimization

- Zustand for efficient state updates
- LocalStorage for persistence
- Minimal re-renders
- Optimized component updates

### API Optimization

- Axios interceptors for token management
- Request/response caching where appropriate
- Error handling and retry logic
- Optimized API calls

## Deployment

### Build for Production

```bash
# Create production build
npm run build

# The build folder contains optimized production files
```

### Deployment Platforms

#### Vercel (Recommended)

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Add environment variable: `REACT_APP_API_URL`

#### Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod`
4. Add environment variable in Netlify dashboard

#### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy --only hosting`

#### GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/shopxpress",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Deploy: `npm run deploy`

### Environment Variables in Production

Set `REACT_APP_API_URL` in your deployment platform's environment variables section.

## Development Guidelines

### Code Style

- Follow ESLint configuration
- Use functional components with hooks
- Prefer const over let
- Use meaningful variable and function names
- Add comments for complex logic
- Follow React best practices

### Component Structure

```javascript
// Import statements
import React, { useState, useEffect } from 'react';

// Component definition
const ComponentName = ({ props }) => {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    // JSX
  );
};

export default ComponentName;
```

### File Naming

- Components: PascalCase (e.g., `ProductCard.jsx`)
- Utilities: camelCase (e.g., `useStore.js`)
- Pages: PascalCase (e.g., `UserDashboard.js`)
- Styles: kebab-case (e.g., `app.css`)

### State Management

- Use Zustand for global state (cart, loading states)
- Use React Context for authentication
- Use local state for component-specific state
- Avoid prop drilling

### API Calls

- Use Axios for HTTP requests
- Include authentication token in headers
- Handle errors gracefully
- Show loading states during API calls
- Display user-friendly error messages

## Troubleshooting

### Common Issues

#### Application Not Starting

- Verify Node.js version (v16 or higher)
- Delete `node_modules` and `package-lock.json`, then run `npm install`
- Check for port conflicts (default port 3000)
- Verify all environment variables are set

#### Authentication Not Working

- Verify Firebase configuration in `src/firebase.js`
- Check Firebase Authentication is enabled in Firebase Console
- Verify backend API URL is correct
- Check browser console for errors
- Verify CORS is configured on backend

#### API Calls Failing

- Verify `REACT_APP_API_URL` is set correctly
- Check backend server is running
- Verify CORS configuration on backend
- Check network tab in browser DevTools
- Verify authentication token is being sent

#### Build Errors

- Clear build cache: `rm -rf build node_modules/.cache`
- Verify all dependencies are installed
- Check for syntax errors
- Review build logs for specific errors

#### Routing Issues

- Verify React Router is properly configured
- Check route paths match exactly
- Verify protected routes have proper authentication checks
- Check browser console for routing errors

### Debugging

#### Enable Debug Logging

Add console logs for debugging:

```javascript
console.log('Debug info:', data);
```

#### React DevTools

Install React Developer Tools browser extension for component inspection.

#### Network Inspection

Use browser DevTools Network tab to inspect API requests and responses.

#### Firebase Console

Check Firebase Console for authentication and database issues.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Considerations

- Authentication tokens stored securely
- HTTP-only cookies for sensitive data
- Input validation on all forms
- XSS prevention through React's built-in escaping
- CORS configuration for API calls
- Secure password handling (never logged or exposed)

## Performance Metrics

- Initial load time: Optimized with code splitting
- Time to interactive: Reduced with lazy loading
- Bundle size: Minimized with tree shaking
- Runtime performance: Optimized with React best practices

## Future Enhancements

Potential improvements and features for future development:

- Progressive Web App (PWA) support
- Offline functionality
- Push notifications
- Social login (Google, Facebook)
- Wishlist functionality
- Product comparison
- Recently viewed products
- Advanced analytics integration
- A/B testing capabilities
- Multi-language support (i18n)
- Dark mode theme

## Support and Documentation

- React Documentation: https://react.dev
- Material-UI Documentation: https://mui.com
- React Router Documentation: https://reactrouter.com
- Firebase Documentation: https://firebase.google.com/docs


## Version

Current Version: 0.1.0

Last Updated: November 2025
