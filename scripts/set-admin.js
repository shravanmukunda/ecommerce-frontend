#!/usr/bin/env node

/**
 * Script to set admin role for a user via Clerk API
 * Usage: node scripts/set-admin.js <email>
 * 
 * Requires CLERK_SECRET_KEY environment variable
 */

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/set-admin.js <email>");
  process.exit(1);
}

const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (!clerkSecretKey) {
  console.error("Error: CLERK_SECRET_KEY environment variable not set");
  process.exit(1);
}

async function setAdminRole() {
  try {
    console.log(`🔍 Finding user with email: ${email}`);

    // Step 1: Get user by email
    const getUserResponse = await fetch(
      `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${clerkSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!getUserResponse.ok) {
      throw new Error(`Failed to fetch user: ${getUserResponse.statusText}`);
    }

    const users = await getUserResponse.json();

    if (!Array.isArray(users) || users.length === 0) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    const user = users[0];
    console.log(`✅ Found user: ${user.id}`);

    // Step 2: Update user metadata with admin role
    console.log(`🔄 Setting admin role...`);

    const updateResponse = await fetch(
      `https://api.clerk.com/v1/users/${user.id}/metadata`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${clerkSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_metadata: {
            role: "admin",
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Failed to update user: ${updateResponse.statusText}`);
    }

    const updatedUser = await updateResponse.json();
    console.log(`✅ Admin role set successfully!`);
    console.log(`📧 Email: ${updatedUser.email_addresses[0]?.email_address}`);
    console.log(`🎭 Role: ${updatedUser.public_metadata?.role}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setAdminRole();
