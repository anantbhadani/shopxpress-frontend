# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `shopxpress-frontend/` directory with the following:

### Backend API Configuration

```env
REACT_APP_API_URL=https://shopxpress-backend.onrender.com/api
```

### Firebase Configuration

```env
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Complete .env File Example

```env
# Backend API URL
REACT_APP_API_URL=https://shopxpress-backend.onrender.com/api

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyBCYXeXC_ZTf_cssFKCqY0yMn-_fukLPh8
REACT_APP_FIREBASE_AUTH_DOMAIN=server-19d74.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://server-19d74-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=server-19d74
REACT_APP_FIREBASE_STORAGE_BUCKET=server-19d74.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=392175592720
REACT_APP_FIREBASE_APP_ID=1:392175592720:web:d1030a805feff1fc363195
REACT_APP_FIREBASE_MEASUREMENT_ID=G-0DYGR19PLK
```

## For Development (Local Backend)

If you're running the backend locally, use:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Keep the Firebase configuration the same (Firebase is cloud-hosted).

## For Production

Use the deployed Render backend URL:

```env
REACT_APP_API_URL=https://shopxpress-backend.onrender.com/api
```

## Important Notes

- The `.env` file should be in the root of the `shopxpress-frontend/` directory
- Environment variables must start with `REACT_APP_` to be accessible in React
- After changing `.env`, restart the development server (`npm start`)
- The `.env` file is already in `.gitignore` and should not be committed to version control
- **Never commit Firebase API keys or other secrets to version control**

## Getting Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app or create a new one
6. Copy the configuration values to your `.env` file

## Current Backend URL

**Production Backend:** `https://shopxpress-backend.onrender.com`

**API Base URL:** `https://shopxpress-backend.onrender.com/api`

## Verification

To verify the backend is accessible, you can test:

1. Health endpoint: `https://shopxpress-backend.onrender.com/health`
2. Root endpoint: `https://shopxpress-backend.onrender.com/`

Both should return successful responses if the backend is deployed correctly.

