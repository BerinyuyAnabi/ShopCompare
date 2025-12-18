# ShopCompare Deployment Guide

## University Server Deployment Instructions

### Server Information
- **URL**: http://169.239.251.102:3410/~logan.anabi/ShopCompare/
- **Frontend Path**: `/~logan.anabi/ShopCompare/frontend/`
- **Backend Path**: `/~logan.anabi/ShopCompare/backend/`

### Step 1: Upload Backend Files

Upload the entire `backend` folder to the server:
```
/~logan.anabi/ShopCompare/backend/
├── api/
├── config/
├── middleware/
└── uploads/
```

**Important Files to Upload:**
- `backend/api/*.php` - All API endpoints
- `backend/config/cors.php` - CORS configuration (already configured for university server)
- `backend/config/database.php` - Database connection (already configured)
- `backend/middleware/auth.php` - Authentication middleware

### Step 2: Upload Frontend Build Files

Upload the contents of the `frontend/dist` folder (NOT the dist folder itself) to:
```
/~logan.anabi/ShopCompare/frontend/
```

Your server directory should look like:
```
/~logan.anabi/ShopCompare/frontend/
├── index.html
├── assets/
│   ├── index-PsPL1pf3.js
│   ├── index-a4KoJnfl.css
│   └── logo-DihGiNTY.png
```

### Step 3: Verify PHP Test Endpoint

After uploading, test if PHP is working by visiting:
```
http://169.239.251.102:3410/~logan.anabi/ShopCompare/backend/api/test.php
```

You should see a JSON response like:
```json
{
  "success": true,
  "message": "PHP backend is working correctly",
  "timestamp": "2025-12-18 12:00:00",
  "server_info": {
    "php_version": "8.x.x",
    "server_software": "Apache/x.x.x"
  }
}
```

### Step 4: Verify Database Connection

Visit the stats endpoint to verify database connectivity:
```
http://169.239.251.102:3410/~logan.anabi/ShopCompare/backend/api/stats.php
```

### Step 5: Access the Application

Open your browser and navigate to:
```
http://169.239.251.102:3410/~logan.anabi/ShopCompare/frontend/
```

## Configuration Files Already Updated

### 1. CORS Configuration (`backend/config/cors.php`)
- Already allows requests from university server origin
- Allows credentials for session management

### 2. Vite Build Configuration (`frontend/vite.config.js`)
- Base path set to: `/~logan.anabi/ShopCompare/frontend/`
- Build output directory: `dist`

### 3. API Configuration (`frontend/src/config/api.js`)
- Automatically detects production environment
- Uses correct API path: `http://169.239.251.102:3410/~logan.anabi/ShopCompare/backend/api`

## Troubleshooting

### Issue: "404 Not Found"
- Verify files are uploaded to correct directory
- Check that `index.html` is in `/~logan.anabi/ShopCompare/frontend/`

### Issue: "API endpoints not working"
- Test the test endpoint first: `/backend/api/test.php`
- Check PHP error logs on the server
- Verify database credentials in `backend/config/database.php`

### Issue: "CORS errors"
- Verify `cors.php` is included in all API endpoints
- Check that credentials are being sent with requests

### Issue: "Session not persisting"
- Ensure cookies are enabled
- Check session configuration in PHP
- Verify `session_start()` is called in API endpoints

## Local Development vs Production

### Local Development
- Run `npm run dev` in frontend directory
- Uses Vite dev server at `http://localhost:5173`
- API requests proxied to `http://localhost:8888`

### Production Build
- Run `npm run build` in frontend directory
- Upload `dist` folder contents to university server
- API requests go directly to university server

## Files NOT to Upload

- `node_modules/` - Don't upload this folder
- `frontend/src/` - Source files not needed in production
- `.git/` - Git repository files
- `package.json`, `vite.config.js` - Development files (keep on local only)

## Database Configuration

Database is already configured for university server:
- **Host**: webtech_2025A_logan_anabi
- **Port**: 3306
- **Username**: logan.anabi
- **Password**: (already configured in database.php)
