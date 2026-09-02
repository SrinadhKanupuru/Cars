import React from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an unexpected error while retrieving data. Please try again.",
  onRetry,
  className
}) {
  return (
    <div className={cn("text-center py-12 px-6 rounded-3xl border border-rose-100 bg-rose-50/30 max-w-lg mx-auto my-8 space-y-4", className)}>
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 font-display">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
