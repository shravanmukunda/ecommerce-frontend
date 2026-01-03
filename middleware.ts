import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define routes that require admin role
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Extract role from session claims - matching Go backend logic
function extractRoleFromClaims(sessionClaims: any): string {
  if (!sessionClaims) return '';

  // Check multiple possible locations for role (matching Go backend extractRoleFromMetadata)
  // 1. org_metadata.role
  if (sessionClaims.org_metadata?.role) {
    return String(sessionClaims.org_metadata.role);
  }
  
  // 2. public_metadata.role (most common location)
  if (sessionClaims.public_metadata?.role) {
    return String(sessionClaims.public_metadata.role);
  }
  
  // 3. metadata.role
  if (sessionClaims.metadata?.role) {
    return String(sessionClaims.metadata.role);
  }
  
  // 4. org_role
  if (sessionClaims.org_role) {
    return String(sessionClaims.org_role);
  }
  
  // 5. role (direct)
  if (sessionClaims.role) {
    return String(sessionClaims.role);
  }

  return '';
}

export default clerkMiddleware(async (auth, req) => {
  // Check if the route requires admin access
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();
    
    // If user is not authenticated, redirect to login
    if (!userId) {
      const signInUrl = new URL('/login', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Extract role using the same logic as Go backend
    const userRole = extractRoleFromClaims(sessionClaims);

    // If user doesn't have admin role, redirect to home with error message
    if (userRole !== 'admin') {
      const homeUrl = new URL('/', req.url);
      homeUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(homeUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

