import { clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This endpoint syncs user metadata from Clerk
 * Call this after setting metadata in Clerk Dashboard
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Fetch user from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        publicMetadata: user.publicMetadata,
      },
    });
  } catch (error: any) {
    console.error('Error syncing metadata:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
