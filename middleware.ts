import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define routes that require admin role
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // 🔍 ENHANCED DEBUG - Logs appear in SERVER TERMINAL (not browser console)
  const timestamp = new Date().toISOString();
  const pathname = req.nextUrl.pathname;
  
  console.log('\n🚀 ========== MIDDLEWARE EXECUTED ==========');
  console.log(`⏰ Time: ${timestamp}`);
  console.log(`📍 Path: ${pathname}`);
  console.log(`🔗 Full URL: ${req.url}`);
  console.log(`🔍 Method: ${req.method}`);
  
  const { userId, sessionClaims } = await auth();

  console.log(`👤 User ID: ${userId || 'NOT AUTHENTICATED'}`);
  
  if (sessionClaims) {
    // IMPORTANT: support both camelCase & snake_case
    const role =
      (sessionClaims as any)?.publicMetadata?.role ||
      (sessionClaims as any)?.public_metadata?.role;
    
    console.log(`🎭 Role: ${role || 'NO ROLE FOUND'}`);
    console.log(`📋 Session Claims Keys: ${Object.keys(sessionClaims).join(', ')}`);
    
    if ((sessionClaims as any)?.publicMetadata) {
      console.log(`📦 publicMetadata:`, JSON.stringify((sessionClaims as any).publicMetadata, null, 2));
    }
    if ((sessionClaims as any)?.public_metadata) {
      console.log(`📦 public_metadata:`, JSON.stringify((sessionClaims as any).public_metadata, null, 2));
    }
  } else {
    console.log('⚠️  No session claims found');
  }

  const isAdmin = isAdminRoute(req);
  console.log(`🛡️  Is Admin Route: ${isAdmin}`);

  if (isAdmin) {
    if (!userId) {
      console.log('❌ No userId - Redirecting to /login');
      console.log('==========================================\n');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // IMPORTANT: support both camelCase & snake_case
    const role =
      (sessionClaims as any)?.publicMetadata?.role ||
      (sessionClaims as any)?.public_metadata?.role;

    console.log(`🔐 Checking role for admin access: ${role}`);

    if (role !== 'admin') {
      console.log('❌ Not admin - Redirecting to /');
      console.log('==========================================\n');
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    console.log('✅ Admin access granted');
  }

  console.log('✅ Middleware passed - Continuing to route');
  console.log('==========================================\n');
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
