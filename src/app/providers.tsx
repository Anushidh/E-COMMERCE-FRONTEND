import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          {children}
          <Toaster
            position="bottom-right"
            closeButton
            toastOptions={{
              style: {
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-base)',
                padding: '16px 20px',
              },
            }}
          />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
