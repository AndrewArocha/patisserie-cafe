# Patisserie Café

A React and TypeScript storefront for Patisserie Café at 676 Amsterdam Ave, New York, NY 10025. The client provides menu, contact, account, and order routes. The Express API provides account management, customer-owned orders, and a Stripe Checkout integration that never handles raw card details.

## Requirements

- Node.js 20.19+ or 22.12+
- MongoDB
- Stripe account and API secret for live checkout

## Setup

From this folder, install dependencies for the root tools and both apps, then copy `server/.env.example` to `server/.env`. Set `MONGODB_URI`, a long random `JWT_SECRET` (32+ characters), and `CLIENT_ORIGIN`. Set `STRIPE_SECRET_KEY` to enable hosted checkout. Enable Stripe Tax and register the applicable tax locations in Stripe before accepting live payments; checkout collects a billing address and asks Stripe Tax to calculate applicable tax. Set `VITE_API_URL` in `client/.env` when the API is not at `http://localhost:4000/api`.

```sh
npm run install:all
npm run dev
```

The Vite client runs at `http://localhost:5173` and the API at `http://localhost:4000/api`. To compile both workspaces and serve the compiled API:

```sh
npm run build
npm start
```

For production, serve the built client (`client/dist`) from a static host and set `VITE_API_URL` at build time. Keep server secrets only in the server environment. The API intentionally returns 404 for protected routes when the bearer token is missing or invalid. The public `/api/health` response is stable and does not inspect authentication.

## API outline

- `GET /api/health` — stable public status
- `POST /api/auth/signup`, `POST /api/auth/signin` — public, rate limited
- `GET /api/users/me`, `DELETE /api/users/me` — authenticated current account
- `GET /api/orders`, `POST /api/orders`, `DELETE /api/orders/:id` — authenticated owner-scoped orders
- `POST /api/payments/checkout` — authenticated Stripe Checkout session

All protected responses exclude password hashes. Order data is selected and scoped by its owner. Validation runs before database operations, errors are handled centrally, and database connection pooling is capped.
