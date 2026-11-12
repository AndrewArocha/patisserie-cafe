# Patisserie Café

A storefront for Patisserie Café in New York. Customers can browse the menu, create an account, manage their orders, and pay through hosted Stripe Checkout. The storefront does not handle raw card details.

[Visit the storefront](https://www.patisseriecafe.co/)

**Stack:** React, TypeScript, Vite, Tailwind CSS, Express, MongoDB, and Stripe.

## Run locally

You'll need Node.js 24, npm, and a running MongoDB instance.

1. Run `npm run install:all` from the repository root.
2. Copy [`server/.env.example`](./server/.env.example) to `server/.env`. Set `MONGODB_URI` and replace `JWT_SECRET` with a long random value (at least 32 characters). The example sets the API port to `3000` and the client origin to `http://localhost:3001`.
3. Copy [`client/.env.example`](./client/.env.example) to `client/.env`. Its default is `VITE_API_URL=http://localhost:3000/api`.
4. Run `npm run dev`. Open [http://localhost:3001](http://localhost:3001) for the storefront or [http://localhost:3000/api/health](http://localhost:3000/api/health) to check the API.

Run `npm run lint` to check both apps or `npm run build` to compile them. `npm start` serves the compiled API; the client build is in `client/dist`.

## Deployment and integrations

- **Hosting:** Set `CLIENT_ORIGIN` to the public storefront origin in Render. Set `VITE_API_URL` in Vercel to the deployed API URL ending in `/api` before building.
- **Checkout:** Set `STRIPE_SECRET_KEY` on the server. Use a Stripe test key for local checkout testing. Before accepting live payments, configure the production return URLs and set up Stripe Tax and applicable registrations. Checkout collects a billing address for tax calculation.
- **Email:** Password resets and room rental or catering requests require outbound SMTP settings: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS`. The sender and catering recipient can be configured with `SMTP_FROM` and `CATERING_REQUEST_EMAIL`. An inbound forwarding address alone does not provide outbound SMTP credentials.

## API outline

- `GET /api/health` — stable public status
- `POST /api/auth/signup`, `POST /api/auth/signin` — public, rate limited
- `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` — public, rate limited; reset tokens expire after 30 minutes and are stored hashed
- `GET /api/users/me`, `DELETE /api/users/me` — authenticated current account
- `GET /api/orders`, `POST /api/orders`, `DELETE /api/orders/:id` — authenticated owner-scoped orders
- `POST /api/payments/checkout` — authenticated Stripe Checkout session

All protected responses exclude password hashes. Order data is selected and scoped by its owner. Validation runs before database operations, errors are handled centrally, and database connection pooling is capped.
