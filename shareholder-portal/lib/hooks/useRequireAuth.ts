"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth";
import { useCurrentUser } from "./useShareholders";
import { Shareholder } from "../types/api";

type Role = Shareholder["role"];

export function useRequireAuth(expectedRole?: Role) {
  const router = useRouter();
  const hasToken = authApi.isAuthenticated();

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useCurrentUser({
    enabled: hasToken,
    retry: false,
  });

  // Kick out immediately if no token
  useEffect(() => {
    if (!hasToken) {
      router.replace("/login");
    }
  }, [hasToken, router]);

  // If token invalid/expired, return to login
  useEffect(() => {
    if (error) {
      router.replace("/login");
    }
  }, [error, router]);

  // Enforce role-based access
  useEffect(() => {
    const role = data?.shareholder.role;
    if (!role || !expectedRole || role === expectedRole) return;

    // Redirect user to their correct area
    router.replace(role === "admin" ? "/dashboard" : "/shareholder-dashboard");
  }, [data?.shareholder.role, expectedRole, router]);

  const isChecking = !hasToken || isLoading || isFetching || (!data && !error);
  const isAuthorized =
    !!data && (!expectedRole || data.shareholder.role === expectedRole);

  return {
    user: data?.shareholder,
    isAuthorized,
    isChecking,
  };
}

