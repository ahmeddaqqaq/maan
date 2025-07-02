"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../../client";
import { OpenAPI } from "@/lib/api-config";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored tokens on mount
    const storedAccessToken = localStorage.getItem("access_token");
    const storedRefreshToken = localStorage.getItem("refresh_token");

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsAuthenticated(true);
      
      // Ensure cookie is set if localStorage has token but cookie doesn't
      if (!document.cookie.includes('access_token=')) {
        document.cookie = `access_token=${storedAccessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      
      // Set the token in the OpenAPI client
      if (typeof window !== "undefined") {
        OpenAPI.TOKEN = storedAccessToken;
      }
    }

    setIsLoading(false);
  }, []);

  const login = (newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsAuthenticated(true);

    // Store tokens in localStorage
    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("refresh_token", newRefreshToken);

    // Store access token in cookie for middleware
    document.cookie = `access_token=${newAccessToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

    // Set the token in the OpenAPI client
    if (typeof window !== "undefined") {
      OpenAPI.TOKEN = newAccessToken;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await AuthService.authControllerLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear tokens regardless of API call success
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);

      // Remove tokens from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Remove access token cookie
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Clear token from OpenAPI client
      if (typeof window !== "undefined") {
        OpenAPI.TOKEN = undefined;
      }

      router.push("/login");
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await AuthService.authControllerRefresh();
      
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      
      // Update stored tokens
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);

      // Update access token cookie
      document.cookie = `access_token=${response.access_token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

      // Update token in OpenAPI client
      if (typeof window !== "undefined") {
        OpenAPI.TOKEN = response.access_token;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    accessToken,
    refreshToken,
    login,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}