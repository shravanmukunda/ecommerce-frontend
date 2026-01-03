import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isAdminRoute = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (isAdminRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|map|jpe?g|png|gif|webp|svg|ico|mp4|ttf|woff2?|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
}