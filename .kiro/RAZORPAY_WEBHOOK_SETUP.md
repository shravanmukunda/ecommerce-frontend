# Razorpay Webhook Integration Guide

## Problem Statement

Razorpay does NOT guarantee that frontend JavaScript callbacks will execute in Single Page Applications (SPAs) like Next.js App Router. This is by design, not a bug.

**Why?**
- Popup context changes during SPA navigation
- Browser security policies may prevent callback execution
- Razorpay prioritizes server-side confirmation over frontend callbacks
- Frontend callbacks are treated as "best-effort" UX helpers, not authoritative success signals

**The Result:**
- Payment completes successfully in Razorpay
- Frontend handler callback never executes
- Frontend never redirects to success page
- User is stuck on checkout page
- Payment exists in Razorpay but frontend doesn't know about it

## Solution: Server-Side Payment Confirmation

The correct payment flow is:

```
1. Frontend initiates payment
   ↓
2. Razorpay processes payment
   ↓
3. Razorpay sends webhook to backend (SOURCE OF TRUTH)
   ↓
4. Backend confirms payment and updates database
   ↓
5. Frontend queries backend for payment status
   ↓
6. Frontend reflects backend state (success/failure)
```

## Implementation Steps

### Step 1: Configure Razorpay Webhook

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings > Webhooks**
3. Click **Add New Webhook**
4. Enter webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
5. Select events:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
6. Copy the **Webhook Secret** and add to `.env.local`:

```bash
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### Step 2: Webhook Endpoint

The webhook endpoint is already created at:
```
app/api/webhooks/razorpay/route.ts
```

**What it does:**
- Receives payment events from Razorpay
- Verifies webhook signature (security)
- Updates order status in database
- Triggers order fulfillment workflows

**TODO: Implement database updates**

Currently the webhook logs events but doesn't update the database. You need to:

```typescript
// In handlePaymentSuccess():
const order = await db.orders.findById(orderId);
if (order) {
  await db.orders.update(orderId, {
    paymentStatus: "completed",
    paymentId: paymentId,
    amount: amount / 100, // Razorpay sends in paise
    paidAt: new Date(),
  });
}
```

### Step 3: Payment Status Check Endpoint

The status endpoint is already created at:
```
app/api/orders/[orderId]/status/route.ts
```

**What it does:**
- Frontend calls this after Razorpay modal closes
- Returns payment status from database
- Frontend uses this to decide next action

**TODO: Implement database query**

Currently returns placeholder. You need to:

```typescript
const order = await db.orders.findById(orderId);
if (!order) return { paymentStatus: "not_found" };
return { paymentStatus: order.paymentStatus }; // "completed" | "pending" | "failed"
```

### Step 4: Frontend Checkout Flow

The checkout page is already updated at:
```
app/checkout/page.tsx
```

**Key changes:**
- No longer relies on Razorpay handler callback
- Opens Razorpay modal
- When modal closes, queries backend for payment status
- Redirects based on backend response

**Flow:**
```typescript
1. User clicks "Place Order"
2. Create order in backend
3. Create Razorpay order
4. Open Razorpay modal
5. User completes payment (or closes modal)
6. Call checkPaymentStatus(orderId)
7. Backend returns payment status
8. Frontend redirects to success/failure page
```

## Testing Locally

### Without Webhook (Development)

For local testing without Razorpay webhook:

1. Use Razorpay test credentials
2. Use test card: `4111 1111 1111 1111`
3. Manually update order status in database after payment
4. Frontend will poll `/api/orders/[orderId]/status` and see the update

### With Webhook (Production)

1. Deploy to production
2. Configure webhook in Razorpay Dashboard
3. Razorpay will POST to your webhook endpoint
4. Backend updates database
5. Frontend polls and sees the update

## Environment Variables

Add to `.env.local`:

```bash
# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxx
```

## Database Schema

Your orders table should have:

```sql
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255),
  shippingAddress TEXT,
  totalAmount DECIMAL(10, 2),
  paymentStatus VARCHAR(50), -- "pending" | "completed" | "failed"
  paymentId VARCHAR(255),    -- Razorpay payment ID
  razorpayOrderId VARCHAR(255), -- Razorpay order ID
  failureReason TEXT,
  createdAt TIMESTAMP,
  paidAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

## Security Considerations

1. **Webhook Signature Verification**: Always verify the webhook signature using the secret
2. **Idempotency**: Handle duplicate webhook events (Razorpay may retry)
3. **Amount Verification**: Always verify the payment amount matches the order amount
4. **User Authorization**: Verify the user owns the order before updating

## Troubleshooting

### Payment completes but frontend doesn't redirect

1. Check webhook is configured in Razorpay Dashboard
2. Check webhook secret is correct in `.env.local`
3. Check backend logs for webhook errors
4. Verify database is being updated by webhook
5. Check `/api/orders/[orderId]/status` returns correct status

### Webhook not being called

1. Verify webhook URL is publicly accessible
2. Check Razorpay Dashboard > Webhooks > Logs for failed attempts
3. Verify webhook secret is correct
4. Check server logs for incoming requests

### Payment shows in Razorpay but not in your database

1. Webhook may not have been configured yet
2. Webhook may have failed (check Razorpay logs)
3. Database update code may not be implemented
4. Check server logs for errors

## Next Steps

1. Implement database updates in webhook handler
2. Implement database query in status endpoint
3. Deploy to production
4. Configure webhook in Razorpay Dashboard
5. Test with real payments
6. Monitor webhook logs for errors

## References

- [Razorpay Webhooks Documentation](https://razorpay.com/docs/webhooks/)
- [Razorpay Payment Gateway Integration](https://razorpay.com/docs/payments/payments-gateway/)
- [Webhook Security Best Practices](https://razorpay.com/docs/webhooks/security/)
