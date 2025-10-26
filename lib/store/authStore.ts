"use client";

import { create } from "zustand";
import { User } from "@/types/user";
import apiClient from "@/lib/api/api";

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    clearAuthState: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => {
        set({ user, isAuthenticated: !!user });
    },
    clearAuthState: () => {
        set({ user: null, isAuthenticated: false });
    },
}));

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout"); // правильний endpoint
  } catch (error) {
    console.error("Logout failed:", error);
    // навіть якщо бекенд не відповів — все одно очищуємо стан
  }
};