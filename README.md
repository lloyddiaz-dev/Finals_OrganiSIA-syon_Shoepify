# Shoe-pify

## Overview

Shoe-pify is a full-stack online shoe store built for a web systems project. The application supports product browsing, user authentication, shopping cart management, order processing, review submission, and administrative product management.

## Release

- Version: `v1.0-final`
- Branch: `main`
- Status: Production-ready final release

## Key Features

- Responsive and user-friendly storefront
- User registration and login with secure authentication
- Product catalog, categories, and product search
- Shopping cart and checkout flow
- Order history and order tracking
- Review and rating system for products
- Admin management for products, orders, and reviews

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB / Mongoose
- Deployment-ready architecture with static asset serving

## Repository Structure

- `backend/` - Express server, API routes, data models, and database configuration
- `frontend/` - Main client-facing pages, scripts, and styles
- `docs/` - Project documentation and lab reports

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lloydomarrd-arch/final-project-ParaCodeCode-BSIT2B.git
   cd final-project-ParaCodeCode-BSIT2B/backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables by creating a `.env` file in `backend/`.
   Required variables should include your MongoDB connection string and any auth keys.
4. Start the backend server:
   ```bash
   npm start
   ```
5. Open the frontend pages from the `frontend/` directory in a browser or deploy the entire project to a static host.

## Running Locally

- Backend entrypoint: `backend/server.js`
- API routes are defined in `backend/routes/`
- Models are in `backend/models/`
- Frontend pages are in `frontend/`
- Static assets are in `frontend/css/`, `frontend/js/`, and `frontend/img/`

## Notes

- The backend is built to serve API requests and support a client-side frontend.
- Duplicate or development-only directories have been removed to keep the repository clean.
- `database/` and nested duplicate front-end/backend folders have been cleaned up.

## Contributors

- **Jannus Nicole Robrigado** – Project Manager
- **Joshua Belmonte** – Front-End Developer
- **Philip Mustera** – Back-End Developer
- **John Christopher Ernas** – Database Manager
- **Lloyd Omar Diaz** – GitHub Manager

## Final Improvements

- Consolidated final changes into the `main` branch
- Removed unused duplicate folders and cleanup artifacts
- Created the release tag `v1.0-final`
- Updated project documentation for final delivery
