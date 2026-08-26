# Production Checklist - Rajwadi E-Commerce

## Infrastructure & Environment
- [ ] Database (Neon PostgreSQL) is provisioned and scaled appropriately.
- [ ] Redis/Kafka/SQS are NOT used (confirmed V1 limitation).
- [ ] `.env` is configured correctly on the production server (e.g. AWS/Render).
- [ ] `DATABASE_URL` is secured and not logged.
- [ ] Razorpay keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`) are live keys.
- [ ] Cloudinary credentials are set.

## Database Management
- [ ] Run `npm run db:migrate` in the production environment.
- [ ] Seed admin user using `npm run admin:create` if required.

## Security
- [ ] Helmet is enabled (adds secure HTTP headers).
- [ ] CORS is restricted to the exact frontend origin (no `*`).
- [ ] Rate limits are active (`@fastify/rate-limit`).
- [ ] Pino logger is redacting sensitive fields (auth headers, cookies, keys, passwords).
- [ ] JWT uses a strong, randomly generated `JWT_SECRET` and `JWT_REFRESH_SECRET`.

## Razorpay Webhooks
- [ ] Webhook URL registered in Razorpay Dashboard.
- [ ] Subscribed Events: `payment.captured`, `payment.failed`, `refund.processed`, `refund.failed`, `order.paid`.
- [ ] Secret matches `RAZORPAY_WEBHOOK_SECRET`.

## Operations
- [ ] Worker for expiring orders runs within the Fastify process using `setTimeout`/`setInterval`.
- [ ] Logs are being ingested into a logging service (e.g., CloudWatch, Datadog).
- [ ] Admin panel (frontend) is functional for Order processing and Refunds.
