# Implementation Plan: MongoDB Integration & Admin Access Control

## Overview
This document outlines the steps to transition the application from file-based storage (JSON) to MongoDB Atlas and implement Role-Based Access Control (RBAC) for admin features.

## Phase 1: Database Schema Design & Setup

### 1. Define Mongoose Models
Create Mongoose schemas to define the structure of your data.

- **Product Model**: Define structure for products.
  - Fields: `name`, `description`, `price`, `category`, `image`, `stock`, `createdAt`.
- **Order Model** (if applicable): Define structure for orders.
  - Fields: `user` (ref), `products` (array of refs), `totalAmount`, `status`.



## Phase 2: Authentication & Authorization (RBAC)

### 1. Update User Registration
- Modify the registration API endpoint.
- When creating a new user, ensure the `role` defaults to `'user'`.
- **Manual Step**: Manually update your specific user document in MongoDB Atlas to have `role: 'admin'` for testing admin features.

### 2. Enhance Session Data (NextAuth.js / Auth.js)
To secure routes, the user's role needs to be accessible in the session.
- **JWT Callback**: Modify the `jwt` callback in your Auth configuration. When a user logs in, add `user.role` to the JWT token.
- **Session Callback**: Modify the `session` callback. Pass the `role` from the token to the `session.user` object.
- **Type Definitions** (if using TypeScript): Extend the default Session and User types to include `role`.

## Phase 3: Refactoring Data Access (Replacing JSON Files)

### 1. Product Management (Public)
- **Fetch Products**: In the API route for getting products (e.g., `GET /api/products`), replace file reading logic (`fs.readFile`) with `Product.find({})`.
- **Product Details**: Replace logic for fetching a single product with `Product.findById(id)` or `Product.findOne({ slug })`.

### 2. Product Management (Admin)
- **Add Product**: In `POST /api/admin/products`, replace file writing logic with `new Product(data).save()`.
- **Update Product**: In `PUT /api/admin/products/:id`, use `Product.findByIdAndUpdate()`.
- **Delete Product**: In `DELETE /api/admin/products/:id`, use `Product.findByIdAndDelete()`.

## Phase 4: Protecting Admin Routes

### 1. Backend Protection (API Routes)
- Create a reusable check or middleware function.
- In every admin-specific API route (Create/Update/Delete):
  1. Get the server-side session.
  2. Check if a session exists.
  3. Check if `session.user.role === 'admin'`.
  4. If checks fail, return a `401 Unauthorized` or `403 Forbidden` response immediately.

### 2. Frontend Protection (UI)
- **Middleware (Optional but recommended)**: Use Next.js Middleware (`middleware.ts`) to intercept requests to `/admin/*` paths. Redirect to login or home if the user is not an admin.
- **Component Level**: In admin components/pages, check the session role. If not admin, render a "Access Denied" message or redirect.
- **Navigation**: Only show "Admin Dashboard" links in the navbar if `session.user.role === 'admin'`.

## Phase 5: Cleanup & Testing

### 1. Data Migration (Optional)
- If you have important data in `data.json`, create a temporary script to read the JSON file and insert the records into MongoDB using `insertMany`.

### 2. Remove Legacy Code
- Delete the temporary JSON files (e.g., `products.json`).
- Remove any utility functions related to file system operations (`fs`).

### 3. Verification Steps
- **User Test**: Log in as a standard user. Verify you can view products but cannot access admin routes (try hitting the API directly via Postman/Thunder Client).
- **Admin Test**: Log in as the admin user. Verify you can add, edit, and delete products and that changes persist in MongoDB Atlas.
