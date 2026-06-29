import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '@shared/stores/authStore';
import { Spinner } from '@shared/components';
import { toast } from 'sonner';

/**
 * Handles the OAuth redirect from the backend.
 * Extracts accessToken and refreshToken from URL params,
 * stores them, and redirects to home.
 */
export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      // We don't have user info from the URL — the token is enough.
      // We'll fetch profile on next navigation. Set minimal auth state.
      setAuth(
        { id: '', name: '', email: '' },
        accessToken,
        refreshToken,
        'user',
      );
      toast.success('Logged in with Google');
      navigate('/', { replace: true });
    } else {
      toast.error('Authentication failed');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="lg" />
    </div>
  );
}
