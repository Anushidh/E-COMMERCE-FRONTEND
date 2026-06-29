import { Component, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches unhandled errors in the React component tree.
 * Shows a friendly fallback UI instead of a blank white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.page}>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.text}>We're sorry — an unexpected error occurred.</p>
          <button
            className={styles.btn}
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
          >
            Go to Homepage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
