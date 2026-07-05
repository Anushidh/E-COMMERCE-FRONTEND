import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  role: 'user' | 'admin' | null;
  setAuth: (user: User, accessToken: string, role: 'user' | 'admin') => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      role: null,

      setAuth: (user, accessToken, role) =>
        set({ user, accessToken, isAuthenticated: true, role }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false, role: null }),
    }),
    {
      name: 'auth-storage',
      // Only persist non-sensitive fields — refresh token stays in HttpOnly cookie only
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    },
  ),
);
