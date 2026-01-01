import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * POST /api/webhooks/razorpay
 * 
 * Razorpay webhook endpoint
 * This is the SOURCE OF TRUTH for payment confirmation
 * 
 * Razorpay will POST to this endpoint when payment completes
 * We verify the signature and update order status in database
 * 
 * Setup in Razorpay Dashboard:
 * 1. Go to Settings > Webhooks
 * 2. Add webhook URL: https://yourdomain.com/api/webhooks/razorpay
 * 3. Select events: payment.authorized, payment.failed, payment.captured
 * 4. Copy webhook secret and add to .env.local as RAZORPAY_WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse webhook data
    const event = JSON.parse(body);
    console.log("Razorpay webhook received:", event.event);

    // Handle different payment events
    switch (event.event) {
      case "payment.authorized":
      case "payment.captured":
        await handlePaymentSuccess(event.payload.payment.entity);
        break;

      case "payment.failed":
        await handlePaymentFailure(event.payload.payment.entity);
        break;

      default:
        console.log("Unhandled webhook event:", event.event);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(payment: any) {
  try {
    const { id: paymentId, order_id: orderId, amount } = payment;

    console.log(`Payment successful: ${paymentId} for order ${orderId}`);

    // Update order status in Go backend via GraphQL
    const graphqlUrl = process.env.GRAPHQL_BACKEND_URL || "http://localhost:8080/query";
    
    const mutation = `
      mutation VerifyPayment($input: VerifyPaymentInput!) {
        verifyPayment(input: $input) {
          id
          status
        }
      }
    `;

    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            orderID: orderId,
            paymentID: paymentId,
            amount: amount / 100, // Razorpay sends in paise
            status: "completed",
          },
        },
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error("GraphQL error updating order:", result.errors);
      throw new Error(`Failed to update order: ${result.errors[0]?.message}`);
    }

    console.log(`Order ${orderId} payment status updated to completed`);
  } catch (error) {
    console.error("Error handling payment success:", error);
    throw error;
  }
}

async function handlePaymentFailure(payment: any) {
  try {
    const { id: paymentId, order_id: orderId, error_description } = payment;

    console.log(
      `Payment failed: ${paymentId} for order ${orderId} - ${error_description}`
    );

    // Update order status in Go backend via GraphQL
    const graphqlUrl = process.env.GRAPHQL_BACKEND_URL || "http://localhost:8080/query";
    
    const mutation = `
      mutation VerifyPayment($input: VerifyPaymentInput!) {
        verifyPayment(input: $input) {
          id
          status
        }
      }
    `;

    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            orderID: orderId,
            paymentID: paymentId,
            status: "failed",
            failureReason: error_description,
          },
        },
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error("GraphQL error updating order:", result.errors);
      throw new Error(`Failed to update order: ${result.errors[0]?.message}`);
    }

    console.log(`Order ${orderId} payment status updated to failed`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
    throw error;
  }
}
