"use client";

import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-muted-foreground">{this.state.error?.message || "An unexpected error occurred"}</p>
              <button
                onClick={() => window.location.href = "/"}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Go home
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
