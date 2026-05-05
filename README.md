Hi! We are ParaCodeCode. We copy, we paste, we pray, and sometimes our code still errors. Through all the bugs, late nights, and endless commits, we just whisper to our screens “Sana gumana na.”

## Phase 1: Backend Setup

### Functionality Changes

- **Project Initialization**: Set up backend project configuration and dependencies using Node.js and npm.
- **Database Configuration**: Added database connection module for MongoDB integration.
- **Initial Structure**: Established the foundation for the backend with package.json and basic folder structure.

## Phase 2: Backend Development

### Functionality Changes

- **Data Models**: Implemented Mongoose models for User, Product, Category, Cart, Order, Payment, and Review.
- **API Routes**: Created Express.js routes for all CRUD operations on users, products, categories, carts, orders, payments, and reviews.
- **Server Setup**: Configured Express server with middleware for handling requests and responses.

## Phase 3: Frontend Development

### Functionality Changes

- **HTML Pages**: Developed complete set of HTML pages including index, login, register, dashboard, products, cart, orders, profile, and admin interfaces.
- **JavaScript Functionality**: Added client-side JavaScript for product display, form handling, and user interactions.
- **Styling**: Implemented CSS for responsive design and user-friendly interface.
- **Documentation**: Added Phase-3 Frontend Documentation and Lab 11 README with implementation details.

## Phase 4: Integration and Security

### Functionality Changes

- **API Integration**: Connected frontend forms to backend API endpoints for user registration and authentication.
- **Security Enhancements**: Implemented input validation, XSS protection, and rate limiting to secure the application.

## Phase 5: GitHub and Team Workflow

### Functionality Changes

- **Frontend Updates**: HTML pages and JavaScript files for handling forms have been implemented and connected to the backend API.
- **Backend Enhancements**: API controllers for user registration and other routes have been updated to handle form submissions securely.
- **Security Features**: Implemented validation, XSS protection, and rate limiting to ensure secure interactions.
- **Collaboration**: All changes committed and pushed to GitHub with clear commit messages for team tracking.

## Phase 6: Finalizing CRUD

### Functionality Changes

- **PUT and DELETE API Implementation**: Added backend routes for updating and deleting data using Express and Mongoose. Controllers were configured to handle user edits and removals efficiently.
- **Frontend UI Integration**: Implemented Edit and Delete buttons across relevant pages (e.g., dashboard, listings) with proper data binding using data-id.
- **Edit Functionality**: Created modal forms that preload existing user data. Users can update information, which is then sent to the backend using PUT requests.
- **Delete Functionality**: Added confirmation prompts before deletion and connected DELETE requests to remove data from the database.
- **Database Synchronization**: Verified that all updates and deletions are correctly reflected in MongoDB without inconsistencies.
- **Testing**: API endpoints were tested using Postman/Thunder Client before frontend integration to ensure reliability.
- **GitHub Updates**: All new files (edit.js, delete.js, modals, and updated routes) were committed and pushed to the repository with organized commit logs.
- **Documentation**: Screenshots of edit modals, delete confirmations, and database changes were prepared along with code snippets for the final report.
