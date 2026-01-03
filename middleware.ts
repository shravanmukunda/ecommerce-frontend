import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define routes that require admin role
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Extract role from user object or session claims - matching Go backend logic
function extractRole(user: any, sessionClaims: any): string {
  // First, try to get role from user object (most reliable)
  if (user?.publicMetadata?.role) {
    const role = String(user.publicMetadata.role);
    if (process.env.NODE_ENV === 'development') {
      console.log('Found role in user.publicMetadata:', role);
    }
    return role;
  }

  if (user?.unsafeMetadata?.role) {
    const role = String(user.unsafeMetadata.role);
    if (process.env.NODE_ENV === 'development') {
      console.log('Found role in user.unsafeMetadata:', role);
    }
    return role;
  }

  // Fallback to sessionClaims if user object is not available
  if (!sessionClaims) return '';

  // Debug: Log the sessionClaims structure (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('SessionClaims structure:', JSON.stringify(sessionClaims, null, 2));
  }

  // Check multiple possible locations for role (matching Go backend extractRoleFromMetadata)
  // 1. public_metadata.role (most common location in Clerk)
  const publicMetadata = sessionClaims.public_metadata || sessionClaims.publicMetadata;
  if (publicMetadata?.role) {
    const role = String(publicMetadata.role);
    if (process.env.NODE_ENV === 'development') {
      console.log('Found role in sessionClaims.public_metadata:', role);
    }
    return role;
  }
  
  // 2. metadata.role (alternative location)
  const metadata = sessionClaims.metadata;
  if (metadata?.role) {
    const role = String(metadata.role);
    if (process.env.NODE_ENV === 'development') {
      console.log('Found role in sessionClaims.metadata:', role);
    }
    return role;
  }
  
  // 3. org_metadata.role
  const orgMetadata = sessionClaims.org_metadata || sessionClaims.orgMetadata;
  if (orgMetadata?.role) {
    const role = String(orgMetadata.role);
    if (process.env.NODE_ENV === 'development') {
      console.log('Found role in sessionClaims.org_metadata:', role);
    }
    return role;
  }
  
  // 4. org_role
  if (sessionClaims.org_role || sessionClaims.orgRole) {
    const role = String(sessionClaims.org_role || sessionClaims.orgRole);
    if (process.env.NODE_ENV === 'development') {
      console.log('Found role in sessionClaims.org_role:', role);
    }
    return role;
  }
  
  // 5. role (direct)
  if (sessionClaims.role) {
    const role = String(sessionClaims.role);
    if (process.env.NODE_ENV === 'development') {
      console.log('Found role directly in sessionClaims:', role);
    }
    return role;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('No role found in user object or sessionClaims');
  }
  return '';
}

export default clerkMiddleware(async (auth, req) => {
  // Check if the route requires admin access
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Admin route access attempt:', req.url);
      console.log('UserId:', userId);
    }
    
    // If user is not authenticated, redirect to login
    if (!userId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('No userId, redirecting to login');
      }
      const signInUrl = new URL('/login', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Try to get the full user object to access publicMetadata
    let user = null;
    try {
      user = await currentUser();
      if (process.env.NODE_ENV === 'development') {
        console.log('User object from currentUser():', user ? 'Found' : 'Not found');
        if (user) {
          console.log('User publicMetadata:', user.publicMetadata);
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Error fetching currentUser:', error);
      }
    }

    // Extract role using the same logic as Go backend
    const userRole = extractRole(user, sessionClaims);

    if (process.env.NODE_ENV === 'development') {
      console.log('Extracted user role:', userRole);
      console.log('Is admin?', userRole === 'admin');
    }

    // If user doesn't have admin role, redirect to home with error message
    if (userRole !== 'admin') {
      if (process.env.NODE_ENV === 'development') {
        console.log('User does not have admin role, redirecting to home');
      }
      const homeUrl = new URL('/', req.url);
      homeUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(homeUrl);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Admin access granted');
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

