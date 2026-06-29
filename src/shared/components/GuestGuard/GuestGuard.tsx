import { Navigate } from 'react-router';
import { useAuthStore } from '@shared/stores/authStore';
import type { ReactNode } from 'react';

interface GuestGuardProps {
  children: ReactNode;
}

/**
 * Protects auth routes (login, signup, etc.) from already-authenticated users.
 * Redirects users to home and admins to admin dashboard.
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated) {
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
