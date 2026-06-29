import { useEffect, useState } from 'react';
import { Providers } from './providers';
import { AppRouter } from './router';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { Spinner } from '@shared/components';

export function App() {
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand to hydrate from localStorage before rendering routes
  useEffect(() => {
    // Zustand persist hydrates synchronously on import, but we add a
    // tiny delay to ensure the store is fully ready before route guards run
    const timeout = setTimeout(() => setHydrated(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  if (!hydrated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Providers>
        <AppRouter />
      </Providers>
    </ErrorBoundary>
  );
}
