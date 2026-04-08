/**
 * ErrorBoundary.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Catches unhandled React render errors and shows a friendly fallback UI
 * instead of crashing the entire app — critical for 100k users where edge cases
 * are inevitable.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 *   // Custom fallback:
 *   <ErrorBoundary fallback={<p>Custom error message</p>}>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console (extend to Sentry/Datadog in production)
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <p className="font-semibold text-foreground">เกิดข้อผิดพลาด</p>
            <p className="text-sm text-muted-foreground mt-1">
              {this.state.error?.message ?? "ไม่สามารถโหลดส่วนนี้ได้"}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="h-4 w-4" />
            ลองใหม่
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
