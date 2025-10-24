// Environment variables helper
export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
} as const;

// Environment variables:
// NEXT_PUBLIC_API_URL - API base URL (default: http://localhost:3000/api)
// 
// For production, set NEXT_PUBLIC_API_URL in your deployment configuration
// Example: NEXT_PUBLIC_API_URL=https://your-api-domain.com/api

