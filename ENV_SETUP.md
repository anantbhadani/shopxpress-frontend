# Environment Variables Setup

## Required Environment Variable

Create a `.env` file in the `shopxpress-frontend/` directory with the following:

```env
REACT_APP_API_URL=https://shopxpress-backend.onrender.com/api
```

## For Development (Local Backend)

If you're running the backend locally, use:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

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

## Current Backend URL

**Production Backend:** `https://shopxpress-backend.onrender.com`

**API Base URL:** `https://shopxpress-backend.onrender.com/api`

## Verification

To verify the backend is accessible, you can test:

1. Health endpoint: `https://shopxpress-backend.onrender.com/health`
2. Root endpoint: `https://shopxpress-backend.onrender.com/`

Both should return successful responses if the backend is deployed correctly.

