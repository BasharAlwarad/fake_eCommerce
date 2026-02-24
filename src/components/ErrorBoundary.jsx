import React from 'react';

/**
 * RENDER AS YOU FETCH - Error Boundary
 *
 * This catches errors from Suspense and shows them to the user
 * It's simple and teachable - just shows the error message
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-base-200 px-6 py-10">
          <div className="mx-auto max-w-6xl text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Something went wrong
            </h1>
            <p className="mt-4 text-base text-base-content/70">
              {this.state.error?.message}
            </p>
            <button
              className="btn btn-primary mt-6"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
