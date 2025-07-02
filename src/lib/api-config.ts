import { OpenAPI } from "../../client";

// Configure API base URL
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Configure credentials and headers
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.CREDENTIALS = "include";

// Log the configured base URL for debugging
if (typeof window !== "undefined") {
  console.log("🚀 API Base URL configured:", OpenAPI.BASE);
}

// Export configured OpenAPI for use across the application
export { OpenAPI };
