# Supabase Edge Functions Deployment Guide

## ✅ What's Ready

I've created 5 Supabase Edge Functions to replace your Express.js backend:

1. **`admin-auth`** - Admin login authentication
2. **`admin-dashboard`** - Dashboard analytics
3. **`admin-content`** - Content management (tours, events, restaurants, etc.)
4. **`admin-map-locations`** - Map locations management
5. **`admin-clients`** - Client profiles management

## 🚀 Quick Deployment (Using Supabase Dashboard)

### Option 1: Deploy via Supabase Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard/project/ydycncbqobpljrtknpqd/functions
2. Click "Create a new function"
3. For each function:
   - **Function name**: `admin-auth` (then repeat for others)
   - **Copy the code** from `supabase/functions/admin-auth/index.ts`
   - Paste it into the editor
   - Click "Deploy"

### Option 2: Deploy via CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link project
cd supabase
supabase link --project-ref ydycncbqobpljrtknpqd

# Deploy functions
supabase functions deploy admin-auth
supabase functions deploy admin-dashboard
supabase functions deploy admin-content
supabase functions deploy admin-map-locations
supabase functions deploy admin-clients
```

## 🔐 Set Environment Variables

### In Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/ydycncbqobpljrtknpqd/settings/functions
2. For each function, add these secrets:
   - `SUPABASE_URL` = `https://ydycncbqobpljrtknpqd.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (Get from: Settings → API → service_role key)

### In Netlify Dashboard:

1. Go to: https://app.netlify.com/projects/aruba-travel-buddy-website
2. Site configuration → Environment variables
3. Add:
   - **`NEXT_PUBLIC_SUPABASE_URL`** = `https://ydycncbqobpljrtknpqd.supabase.co`
   - **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** = (Get from Supabase: Settings → API → anon/public key)
4. **Redeploy** after adding variables

## 🎯 How It Works

- **If `NEXT_PUBLIC_SUPABASE_URL` is set**: Website uses Supabase Edge Functions
- **If not set**: Website falls back to Express API (for local dev)

## 📍 Function URLs

After deployment:
- `https://ydycncbqobpljrtknpqd.supabase.co/functions/v1/admin-auth`
- `https://ydycncbqobpljrtknpqd.supabase.co/functions/v1/admin-dashboard`
- `https://ydycncbqobpljrtknpqd.supabase.co/functions/v1/admin-content`
- `https://ydycncbqobpljrtknpqd.supabase.co/functions/v1/admin-map-locations`
- `https://ydycncbqobpljrtknpqd.supabase.co/functions/v1/admin-clients`

## ⚠️ Important Notes

1. **Admin Users**: Make sure your admin users exist in Supabase Auth (not just the database)
2. **Admin Check**: Functions verify `is_admin = true` or `role = 'admin'` in the `users` table
3. **Some endpoints not migrated**: Analytics tracking, content sync still use Express API (will fall back automatically)

