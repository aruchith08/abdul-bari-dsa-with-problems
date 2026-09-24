import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center p-4 font-sans text-black">
          <div className="max-w-md w-full border-2 border-black bg-white p-6 shadow-[4px_4px_0px_#000000]">
            <div className="inline-block border border-black bg-[#FF5E1E] text-black text-xs font-mono font-black px-2 py-0.5 uppercase mb-3 shadow-[1px_1px_0px_#000000]">
              APPLICATION ERROR
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight text-black mb-2">
              SOMETHING WENT WRONG
            </h1>
            <p className="text-xs text-black/70 mb-4 font-sans leading-relaxed">
              An unexpected error occurred while rendering the application. Your progress stored in local storage remains safe.
            </p>
            {this.state.error && (
              <div className="border border-black bg-[#FAFAFA] p-3 text-[11px] font-mono text-rose-700 overflow-x-auto mb-4">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full border-2 border-black bg-[#FF5E1E] px-4 py-2.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              RELOAD APPLICATION
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
