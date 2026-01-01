# Troubleshooting: Environment Variables Not Working

## Problem: Requests Still Going to localhost:8081 Instead of Deployed Backend

### Root Cause
Next.js embeds `NEXT_PUBLIC_*` environment variables at **BUILD TIME**, not runtime. This means:
- If you add/change the env var after starting the dev server, it won't take effect
- You must restart the dev server or rebuild the app

### Solution Steps

1. **Check your environment variable is set correctly:**
   ```bash
   # In your terminal, verify the variable is set
   echo $NEXT_PUBLIC_API_URL
   # Should output: https://auragaze.me/query
   ```

2. **Create/Update `.env.local` file in the project root:**
   ```bash
   NEXT_PUBLIC_API_URL=https://auragaze.me/query
   ```

3. **Restart your development server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   pnpm dev
   # or
   npm run dev
   ```

4. **For production builds:**
   ```bash
   # Set the env var, then rebuild
   export NEXT_PUBLIC_API_URL=https://auragaze.me/query
   pnpm build
   pnpm start
   ```

### Verify It's Working

1. **Check the browser console** - You should see:
   ```
   🔗 GraphQL URL configured: https://auragaze.me/query
   🔗 NEXT_PUBLIC_API_URL from env: https://auragaze.me/query
   ```

2. **Visit the debug page** at `/debug` to see all environment variables

3. **Check Network tab** in browser DevTools - GraphQL requests should go to `https://auragaze.me/query`

### Common Issues

#### Issue: Variable shows "NOT SET" in debug page
**Solution:** Make sure the variable name is exactly `NEXT_PUBLIC_API_URL` (case-sensitive)

#### Issue: Still using localhost after restart
**Solution:** 
- Check `.env.local` file exists in project root (not in a subdirectory)
- Make sure there are no spaces around the `=` sign
- Restart the dev server completely (kill the process and start fresh)

#### Issue: Works in dev but not in production
**Solution:** 
- Set the environment variable in your hosting platform (Vercel, Netlify, etc.)
- Rebuild and redeploy the application

### Alternative: Runtime Configuration (Advanced)

If you need to change the URL without rebuilding, you would need to:
1. Use a server-side API route to proxy requests
2. Or use Next.js runtime config (deprecated in App Router)
3. Or read from a config file that's not embedded at build time

For most cases, setting the env var and restarting is the recommended approach.

