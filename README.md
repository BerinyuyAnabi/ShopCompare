# ShopAre - Product Comparison Platform

A full-stack web application built with **React**, **PHP**, and **MySQL**. Compare products from different stores and find the best deals.

## Tech Stack

- **Frontend**: React
- **Backend**: PHP 
- **Database**: MySQL 
- **Server**: MAMP and school server

## Project Structure

```
ShopCompare/
├── frontend/           # React application
│   ├── src/
│   │   ├── services/  # API service layer
│   │   ├── App.jsx    # Main component
│   │   └── App.css    # Styles
│   └── package.json
├── backend/           # PHP API
│   ├── api/          # API endpoints
│   │   ├── products.php
│   │   └── test.php
│   └── config/       # Configuration files
│       ├── database.php
│       └── cors.php
└── database/         # SQL schemas
    └── README.md
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Run the Application

**Start React  Server:**

```bash
cd frontend
npm run dev
```

The app will run at `http://localhost:5173`

## API Endpoints

Base URL: `http://localhost:8888/ShopCompare/backend/api`



### Example API Request

```javascript
// Get all products
fetch('http://localhost:8888/ShopCompare/backend/api/products.php')
  .then(res => res.json())
  .then(data => console.log(data))
```


### Frontend Development

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development

The PHP backend is served directly by MAMP at:
`http://localhost:8888/ShopCompare/backend/`

