// Environment variables helper
export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || (
    process.env.NODE_ENV === 'production' 
      ? (typeof window !== 'undefined' ? '/api' : 'http://localhost:3000/api') // В браузере используем /api, на сервере localhost:3000
      : 'http://localhost:3000/api'
  ),
} as const;

// Environment variables:
// NEXT_PUBLIC_API_URL - API base URL 
// 
// Development: http://localhost:3000/api (default)
// Production: /api (default, will be proxied to localhost:3000 via next.config.ts rewrites)
// 
// For custom production API, set NEXT_PUBLIC_API_URL in your deployment configuration
// Example: NEXT_PUBLIC_API_URL=https://your-api-domain.com/api

