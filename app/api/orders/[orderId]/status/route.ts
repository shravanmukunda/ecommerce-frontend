import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/orders/[orderId]/status
 * 
 * Check payment status from backend
 * This is called by frontend after Razorpay modal closes
 * Backend queries Razorpay webhook data to confirm payment
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Query Go backend for order status
    const graphqlUrl = process.env.GRAPHQL_BACKEND_URL || "http://localhost:8080/query";
    
    const query = `
      query GetOrder($id: ID!) {
        order(id: $id) {
          id
          status
          payment {
            id
            status
            transactionID
          }
        }
      }
    `;

    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { id: orderId },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL error fetching order:", result.errors);
      return NextResponse.json(
        { error: "Failed to fetch order status" },
        { status: 500 }
      );
    }

    const order = result.data?.order;
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Map order status to payment status
    let paymentStatus = "pending";
    if (order.payment?.status === "completed") {
      paymentStatus = "completed";
    } else if (order.payment?.status === "failed") {
      paymentStatus = "failed";
    }

    return NextResponse.json({
      orderId,
      paymentStatus,
      orderStatus: order.status,
      paymentId: order.payment?.id,
      transactionId: order.payment?.transactionID,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
