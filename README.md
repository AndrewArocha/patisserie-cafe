# Patisserie Café

A storefront for Patisserie Café in New York. Customers can browse the menu, request catering, and follow `/order` to place and pay for orders on SpotOn.

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
- **SpotOn hosted ordering:** The café’s public SpotOn link is built into the storefront. Set `VITE_SPOTON_ORDER_URL` before building the client if the link changes. SpotOn handles checkout and sends the customer confirmation. Verify the published menu, test order routing, and confirm receipt delivery from a customer connection.
- **Order history:** The café account retains its historical order records. To sync new SpotOn orders, obtain SpotOn partner access for the café location with `reporting:orders:read` and verify the API can identify hosted orders and link them securely to the correct café account. The old order creation and checkout endpoints return HTTP 410. Keep `STRIPE_SECRET_KEY` only if the legacy session verification endpoint is still needed.
- **Email:** Password resets use `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`. Catering requests use the same SMTP settings when Cloudflare Email Sending is not configured. Staff requests go to `catering@patisseriecafe.co` by default (override with `CATERING_REQUEST_EMAIL`). The customer receives a receipt after the staff email is accepted. Staff can reply to the customer's email directly to approve or decline.
- **Catering email over HTTPS:** On Render, set `CLOUDFLARE_EMAIL_ACCOUNT_ID` and `CLOUDFLARE_EMAIL_API_TOKEN` with Email Sending permission. This takes precedence over SMTP for catering. The default sender is `catering@patisseriecafe.co` and its domain must be onboarded to Email Sending. An authorized sender override can be set via `CLOUDFLARE_EMAIL_FROM`. Cloudflare sending to arbitrary customer addresses requires Workers Paid. An inbound forwarding rule alone handles messages sent to the alias.
- **Catering email with Resend:** Set `RESEND_API_KEY` to a sending key for `patisseriecafe.co`. Resend takes precedence for catering notifications and receipts and uses `catering@patisseriecafe.co` as the sender. To enable Accept and Reject emails, register the production API's `/api/catering/review-email` URL for Resend's `email.received` event and add its `RESEND_WEBHOOK_SECRET` to Render. Staff actions send a prefilled email to `decisions@catering-review.patisseriecafe.co`. The company Gmail inbox is allowed by default. Add staff sender addresses to `CATERING_REVIEW_SENDERS` as a comma-separated list if they send from their own accounts.

## API outline

- `GET /api/health` — stable public status
- `POST /api/auth/signup`, `POST /api/auth/signin` — public, rate limited
- `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` — public, rate limited; reset tokens expire after 30 minutes and are stored hashed
- `GET /api/users/me`, `DELETE /api/users/me` — authenticated current account
- `GET /api/orders`, `DELETE /api/orders/:id` — authenticated owner-scoped legacy orders
- `GET /api/payments/sessions/:sessionId` — authenticated verification of previously created Stripe sessions
- `POST /api/catering/requests` — public, rate limited, emails the catering team and returns whether the customer receipt was accepted for delivery

All protected responses exclude password hashes. Order data is selected and scoped by its owner. Validation runs before database operations, errors are handled centrally, and database connection pooling is capped.
