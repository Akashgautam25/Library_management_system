# 🚀 Deployment Guide (Vercel)

This project is optimized for deployment on Vercel. Follow these steps for a smooth deployment.

## 1. Backend Deployment

1. Create a new project on Vercel and point it to the `backend/` folder.
2. Add the following **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A long random string for security.
   - `JWT_EXPIRES_IN`: e.g., `1d`
   - `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://your-app.vercel.app`).
   - `NODE_ENV`: Set to `production`.
3. Vercel will automatically detect the `vercel.json` and deploy it as a Serverless Function.

## 2. Frontend Deployment

1. Create a new project on Vercel and point it to the `frontend/` folder.
2. Add the following **Environment Variable**:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.vercel.app/api`).
3. Vercel will build the React app and host it as a static site.

## 🧪 Deployment Features Added

- **CORS Support**: The backend now automatically allows your Vercel frontend URL and any Vercel preview links.
- **Serverless DB Connection**: The backend includes a middleware that ensures a database connection is active for every request, which is essential for Vercel's serverless environment.
- **Dynamic API URL**: The frontend uses `VITE_API_URL` in production, falling back to `/api` only during local development.
