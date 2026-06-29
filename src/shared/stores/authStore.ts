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
  refreshToken: string | null;
  isAuthenticated: boolean;
  role: 'user' | 'admin' | null;
  setAuth: (user: User, accessToken: string, refreshToken: string, role: 'user' | 'admin') => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      role: null,

      setAuth: (user, accessToken, refreshToken, role) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true, role }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, role: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    },
  ),
);
