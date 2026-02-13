# Kumo Dashboard — Full Setup Guide

## What This Is
A complete customer-facing dashboard for your Kumo cloud platform.
It wraps Coolify's API with a branded frontend — your clients never see Coolify.

## Features
- 🔐 User authentication (signup/login)
- 📁 Project management (create, deploy, delete)
- 🖥 Live site preview (desktop/tablet/mobile)
- 🚀 One-click deploy & redeploy
- 📋 Deployment history & logs
- 🗃️ Database management (PostgreSQL, MySQL, MongoDB, Redis)
- 🌐 Domain management with SSL status
- 📊 Analytics dashboard
- 💬 Support chat
- 📖 Documentation
- ⚙️ Settings & account management

## Setup Instructions

### 1. Get Your Coolify API Token
1. Go to http://154.66.198.81:8000
2. Click **Keys & Tokens** in the left sidebar
3. Click **Create New Token**
4. Name it: `kumo-dashboard`
5. Copy the token — you'll need it next

### 2. Create the .env.local File
In this project folder, create a file called `.env.local`:

```
COOLIFY_API_URL=http://localhost:8000
COOLIFY_API_TOKEN=paste-your-token-here
JWT_SECRET=pick-any-long-random-string-here
NEXT_PUBLIC_APP_URL=https://app.getkumo.org
```

Note: COOLIFY_API_URL is `http://localhost:8000` because the dashboard
runs ON the same server as Coolify, so it talks to it locally.

### 3. Push to GitHub
```bash
cd kumo-app
git init
git add .
git commit -m "Kumo dashboard"
git branch -M main
git remote add origin https://github.com/LeonMabiza128/kumo-dashboard.git
git push -u origin main
```

### 4. Deploy on Coolify
1. Go to http://154.66.198.81:8000
2. Projects → + New Resource → Public Repository
3. URL: https://github.com/LeonMabiza128/kumo-dashboard
4. Branch: main
5. Set port: 3000
6. Add environment variables:
   - COOLIFY_API_URL = http://localhost:8000
   - COOLIFY_API_TOKEN = your-token
   - JWT_SECRET = your-secret-string
   - NEXT_PUBLIC_APP_URL = https://app.getkumo.org
7. Set domain to: https://app.getkumo.org
8. Deploy!

### 5. First User
1. Go to https://app.getkumo.org
2. Click "Sign up"
3. Create your admin account
4. You're in the dashboard!
