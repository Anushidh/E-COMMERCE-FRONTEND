import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '@shared/stores/authStore';
import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import { Spinner } from '@shared/components';
import { toast } from 'sonner';

/**
 * Handles the OAuth redirect from the backend.
 * The backend sends only the access token in the URL — the refresh token
 * is set as an HttpOnly cookie and never exposed in the URL.
 * Fetches the user profile to populate the auth store with real user data.
 */
export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      toast.error('Authentication failed');
      navigate('/login', { replace: true });
      return;
    }

    // Fetch profile using the access token to get real user data
    apiClient
      .get(ENDPOINTS.USER.PROFILE, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const user = res.data?.data;
        setAuth(
          { id: user._id, name: user.name, email: user.email },
          accessToken,
          'user',
        );
        toast.success('Logged in with Google');
        navigate('/', { replace: true });
      })
      .catch(() => {
        toast.error('Authentication failed');
        navigate('/login', { replace: true });
      });
  }, [searchParams, navigate, setAuth]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="lg" />
    </div>
  );
}
