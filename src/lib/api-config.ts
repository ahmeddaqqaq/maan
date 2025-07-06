import { OpenAPI } from "../../client";

// Configure API base URL
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Configure credentials and headers
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.CREDENTIALS = "include";

// Token will be set dynamically by the auth provider

// Log the configured base URL for debugging
if (typeof window !== "undefined") {
  console.log("🚀 API Base URL configured:", OpenAPI.BASE);

  // Debug token setting
  Object.defineProperty(OpenAPI, "TOKEN", {
    get() {
      const token = this._token;
      console.log(
        "🔑 Getting token:",
        token ? `${token.substring(0, 10)}...` : "null"
      );
      return token;
    },
    set(value) {
      console.log(
        "🔑 Setting token:",
        value ? `${value.substring(0, 10)}...` : "null"
      );
      this._token = value;
    },
  });
}

// Export configured OpenAPI for use across the application
export { OpenAPI };
