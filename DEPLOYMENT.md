# Vercel Deployment Guide

## Overview
This project consists of two parts that need to be deployed separately on Vercel:
1. **Frontend** (React + Vite) - `front_end/`
2. **Backend** (Express API) - `back_end/`

---

## Step 1: Deploy Backend API

### 1.1 Set up PostgreSQL Database
Choose one of these options:

**Option A: Neon (Recommended)**
- Go to https://neon.tech
- Create a new project
- Copy the connection string (looks like: `postgresql://user:pass@host.neon.tech/dbname?sslmode=require`)

**Option B: Supabase**
- Go to https://supabase.com
- Create a new project
- Get PostgreSQL connection details from Settings → Database

**Option C: Railway**
- Go to https://railway.app
- Create a PostgreSQL database
- Copy connection details

### 1.2 Deploy Backend to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository: `Ndjanamaeva/ngomna_official_website`
3. Configure project settings:
   - **Project Name**: `ngomna-backend` (or your choice)
   - **Root Directory**: `back_end`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

4. Add Environment Variables (click "Add" for each):
   ```
   DB_NAME=ngomna
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_HOST=your_db_host
   DB_PORT=5432
   DB_SSL=true
   NODE_ENV=production
   ```

5. Click **Deploy**

6. Once deployed, copy your backend URL (e.g., `https://ngomna-backend.vercel.app`)

---

## Step 2: Deploy Frontend

### 2.1 Deploy Frontend to Vercel
1. Go to https://vercel.com/new
2. Import the same repository again: `Ndjanamaeva/ngomna_official_website`
3. Configure project settings:
   - **Project Name**: `ngomna-frontend` (or your choice)
   - **Root Directory**: `front_end`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variable:
   ```
   VITE_API_URL=https://ngomna-backend.vercel.app
   ```
   (Replace with your actual backend URL from Step 1.2.6)

5. Click **Deploy**

---

## Step 3: Verify Deployment

### 3.1 Test Backend
Open `https://your-backend.vercel.app/api/menus` - you should see JSON data

### 3.2 Test Frontend
Open `https://your-frontend.vercel.app` - your app should load and connect to the backend

---

## Local Development

### Backend
```bash
cd back_end
npm install
npm start
```

### Frontend
```bash
cd front_end
npm install
npm run dev
```

---

## Important Notes

1. **Database Migration**: After deploying the backend, you'll need to run database migrations/seeds to populate your PostgreSQL database with the initial data.

2. **CORS**: The backend is configured with CORS enabled to allow frontend requests.

3. **Environment Variables**: 
   - Never commit `.env` files to Git
   - Update `VITE_API_URL` in Vercel when you redeploy the backend

4. **Automatic Deployments**: Both projects will auto-deploy when you push to `main` branch

---

## Troubleshooting

### Backend 404 Errors
- Check that Root Directory is set to `back_end`
- Verify environment variables are set correctly
- Check deployment logs in Vercel dashboard

### Frontend 404 on Page Refresh
- The `vercel.json` file handles SPA routing
- Make sure it's included in your deployment

### API Connection Failed
- Verify `VITE_API_URL` environment variable in frontend Vercel settings
- Check backend is actually deployed and accessible
- Open browser console to see network errors

---

## Links
- Frontend Deployment: https://vercel.com/new
- Backend Deployment: https://vercel.com/new
- Neon Database: https://neon.tech
- Vercel Documentation: https://vercel.com/docs
