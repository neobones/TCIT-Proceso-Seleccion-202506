import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Logger } from '@shared/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Logger.error('ErrorBoundary capturó un error', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h3>Oops! Algo salió mal</h3>
            <p>Ha ocurrido un error inesperado en esta sección.</p>
            {this.state.error && import.meta.env.DEV && (
              <details className="error-details">
                <summary>Detalles del error (solo desarrollo)</summary>
                <pre>{this.state.error.stack}</pre>
              </details>
            )}
            <button 
              onClick={this.handleRetry}
              className="retry-button"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 