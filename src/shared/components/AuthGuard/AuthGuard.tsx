import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '@shared/stores/authStore';
import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Protects routes that require user authentication.
 * Redirects to /login with a return URL if not authenticated.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || role !== 'user') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
