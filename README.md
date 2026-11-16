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
- **SpotOn hosted ordering:** Set `VITE_SPOTON_ORDER_URL` to the café’s public SpotOn ordering URL before building the client. Customers browse the café menu and build their order on SpotOn. Set `CHECKOUT_PROVIDER=spoton` on the API at cutover to prevent new Stripe sessions. Verify the ordering URL, menu, and order routing from a customer connection before switching.
- **Legacy checkout:** With `CHECKOUT_PROVIDER=stripe` and the SpotOn URL unset, the storefront uses Stripe Checkout. Use a Stripe test key for local checkout testing. Preserve the existing Stripe secret and return URLs during cutover if completed Stripe sessions still need confirmation.
- **Email:** Password resets use `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`. Catering requests use the same SMTP settings by default and go to `catering@patisseriecafe.co`. Override the recipient with `CATERING_REQUEST_EMAIL`.
- **Catering email over HTTPS:** Set `CLOUDFLARE_EMAIL_ACCOUNT_ID`, `CLOUDFLARE_EMAIL_API_TOKEN` with Email Sending permission, and `CLOUDFLARE_EMAIL_FROM` on a sending domain enabled in Cloudflare. This takes precedence over SMTP for catering requests. On a plan limited to verified destinations, set `CATERING_REQUEST_EMAIL` to the verified inbox itself. Keep the public alias for direct inquiries.

## API outline

- `GET /api/health` — stable public status
- `POST /api/auth/signup`, `POST /api/auth/signin` — public, rate limited
- `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` — public, rate limited; reset tokens expire after 30 minutes and are stored hashed
- `GET /api/users/me`, `DELETE /api/users/me` — authenticated current account
- `GET /api/orders`, `POST /api/orders`, `DELETE /api/orders/:id` — authenticated owner-scoped orders
- `POST /api/payments/checkout` — authenticated Stripe Checkout session
- `POST /api/catering/requests` — public, rate limited, emails the catering team after review

All protected responses exclude password hashes. Order data is selected and scoped by its owner. Validation runs before database operations, errors are handled centrally, and database connection pooling is capped.
