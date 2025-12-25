# Razorpay Payment Implementation - Complete

## Overview
Implemented server-side payment confirmation for Razorpay integration. The system uses webhooks as the source of truth for payment status, not frontend callbacks.

## Architecture

### Why Server-Side Confirmation?
Razorpay frontend callbacks in SPAs are **NOT guaranteed to execute**. This is by design. The callback is only a "best-effort" UX helper, not an authoritative success signal. Payment can complete in Razorpay but the frontend callback never fires, leaving the user in limbo.

**Solution**: Use Razorpay webhooks (server-to-server) as the authoritative payment confirmation mechanism.

## Implementation Details

### 1. Webhook Endpoint: `/api/webhooks/razorpay`
**File**: `app/api/webhooks/razorpay/route.ts`

**Responsibilities**:
- Receives payment events from Razorpay (payment.authorized, payment.captured, payment.failed)
- Verifies webhook signature using `RAZORPAY_WEBHOOK_SECRET`
- Calls Go backend's `verifyPayment` mutation to update order status
- Handles both success and failure cases

**Flow**:
```
Razorpay Payment → Razorpay Webhook → /api/webhooks/razorpay
                                      ↓
                              Verify Signature
                                      ↓
                              Call Go Backend
                              (verifyPayment mutation)
                                      ↓
                              Update Order Status
```

**Key Functions**:
- `handlePaymentSuccess()`: Updates order to "completed" status
- `handlePaymentFailure()`: Updates order to "failed" status

### 2. Status Check Endpoint: `/api/orders/[orderId]/status`
**File**: `app/api/orders/[orderId]/status/route.ts`

**Responsibilities**:
- Frontend queries this endpoint after Razorpay modal closes
- Queries Go backend for current order status
- Returns payment status (completed, pending, or failed)

**Flow**:
```
Frontend (after modal closes)
        ↓
GET /api/orders/[orderId]/status
        ↓
Query Go Backend (GetOrder query)
        ↓
Return Payment Status
        ↓
Frontend: Redirect to success or show error
```

### 3. Frontend Integration: `app/checkout/page.tsx`
**Changes**:
- Opens Razorpay modal without relying on handler callback
- When modal closes, calls `/api/orders/[orderId]/status` to check payment
- Redirects to success page only if backend confirms payment
- Polls status endpoint if payment is still pending

**Key Function**: `checkPaymentStatus(orderId)`

## Configuration

### Environment Variables
Add to `.env.local`:
```
GRAPHQL_BACKEND_URL=http://localhost:8080/query
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>
```

### Razorpay Dashboard Setup
1. Go to Settings > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events:
   - payment.authorized
   - payment.captured
   - payment.failed
4. Copy webhook secret and add to `.env.local`

## Payment Flow

### Success Path
```
1. User fills checkout form
2. Frontend creates order via createOrder mutation
3. Frontend creates Razorpay order via createRazorpayOrder mutation
4. Frontend opens Razorpay modal
5. User completes payment in Razorpay
6. Razorpay sends webhook to /api/webhooks/razorpay
7. Webhook verifies signature and calls Go backend's verifyPayment
8. Go backend updates order status to "completed"
9. User closes modal (or modal auto-closes)
10. Frontend calls /api/orders/[orderId]/status
11. Backend returns paymentStatus: "completed"
12. Frontend redirects to /order-success
```

### Failure Path
```
1-5. Same as success
6. Payment fails in Razorpay
7. Razorpay sends payment.failed webhook
8. Webhook calls Go backend's verifyPayment with status: "failed"
9. Go backend updates order status to "failed"
10. User closes modal
11. Frontend calls /api/orders/[orderId]/status
12. Backend returns paymentStatus: "failed"
13. Frontend shows error message
```

## Backend Integration

### Go Backend Mutations Used
- `createOrder(input: CreateOrderInput!)`: Creates order
- `createRazorpayOrder(orderID: ID!)`: Creates Razorpay order
- `verifyPayment(input: VerifyPaymentInput!)`: Updates payment status (called by webhook)

### VerifyPaymentInput Structure
```graphql
input VerifyPaymentInput {
  orderID: ID!
  paymentID: String!
  amount: Float
  status: String!
  failureReason: String
}
```

## Testing

### Local Testing
1. Ensure Go backend is running on `http://localhost:8080/query`
2. Ensure Node proxy is running on `http://localhost:8081/query`
3. Use Razorpay test credentials (already in `.env.local`)
4. Test payment flow in Razorpay test mode

### Webhook Testing
Use Razorpay Dashboard webhook testing or tools like:
- Postman
- ngrok (to expose local endpoint)
- Razorpay webhook simulator

### Manual Webhook Test
```bash
curl -X POST http://localhost:3000/api/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: <signature>" \
  -d '{
    "event": "payment.captured",
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_123",
          "order_id": "order_456",
          "amount": 50000,
          "status": "captured"
        }
      }
    }
  }'
```

## Error Handling

### Webhook Errors
- Missing signature: Returns 400
- Invalid signature: Returns 401
- Missing webhook secret: Returns 500
- GraphQL errors: Logged and re-thrown

### Status Check Errors
- Missing order ID: Returns 400
- Order not found: Returns 404
- GraphQL errors: Returns 500

## Security

### Webhook Signature Verification
- Uses HMAC-SHA256 with webhook secret
- Prevents unauthorized webhook calls
- Signature verified before processing payment

### Authorization
- Webhook endpoint is public (no auth required)
- Status endpoint is public (order ID is not sensitive)
- Go backend handles authorization for order queries

## Monitoring

### Logs to Check
1. Webhook receipt: `"Razorpay webhook received: [event]"`
2. Payment success: `"Payment successful: [paymentId] for order [orderId]"`
3. Payment failure: `"Payment failed: [paymentId] for order [orderId]"`
4. Order update: `"Order [orderId] payment status updated to [status]"`

### Common Issues
- **Webhook not received**: Check Razorpay Dashboard webhook logs
- **Signature mismatch**: Verify webhook secret in `.env.local`
- **Order not found**: Check order ID format in Razorpay
- **Backend unreachable**: Ensure Go backend is running on correct port

## Files Modified
- `app/checkout/page.tsx`: Frontend integration
- `app/api/webhooks/razorpay/route.ts`: Webhook handler
- `app/api/orders/[orderId]/status/route.ts`: Status check endpoint
- `.env.local`: Added GRAPHQL_BACKEND_URL and RAZORPAY_WEBHOOK_SECRET
