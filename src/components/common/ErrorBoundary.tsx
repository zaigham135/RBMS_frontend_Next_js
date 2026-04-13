"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-950/20 p-8 text-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            This section failed to load.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-xs text-red-600 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
