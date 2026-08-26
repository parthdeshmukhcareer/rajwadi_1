# Architecture

## Overview
Rajwadi E-Commerce is a decoupled full-stack application utilizing a React frontend and a Node.js/Fastify backend.

## Frontend (React + Vite)
- **Framework**: React 18, utilizing functional components and hooks.
- **Bundler**: Vite for fast development and optimized production builds.
- **Routing**: Client-side routing for SPA experience.
- **State**: React state, communicating with REST APIs.

## Backend (Fastify + Node.js)
- **Framework**: Fastify for high-performance RESTful API endpoints.
- **Modules**: Designed in a modular approach (e.g., `auth`, `products`, `orders`, `cart`, `payments`).
- **ORM**: Drizzle ORM used for type-safe database queries and migrations.
- **Database**: Neon PostgreSQL.
- **Images**: Cloudinary for product image hosting.
- **Payments**: Razorpay for checkout and webhook fulfillment.

## Deployment & Environments
- **Environment Management**: dotenv handles `.env` configurations.
- **Database Connection**: Uses connection pooling via Neon's connection strings.
