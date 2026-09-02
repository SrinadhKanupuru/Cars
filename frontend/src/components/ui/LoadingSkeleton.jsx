import React from 'react';
import { cn } from '../../utils/cn';
import { Sparkles, AlertCircle, RefreshCw, Car } from 'lucide-react';
import { Button } from './Button';

export function LoadingSkeleton({ count = 3, type = "card" }) {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-luxury animate-pulse space-y-4">
            <div className="h-56 bg-slate-200 rounded-2xl w-full" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-11 bg-slate-200 rounded-xl w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="w-full space-y-3 animate-pulse">
        <div className="h-12 bg-slate-100 rounded-2xl w-full" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  return <div className="h-48 bg-slate-100 rounded-3xl animate-pulse w-full" />;
}

export function EmptyState({
  title = "No vehicles found",
  description = "Try adjusting your search terms, price ranges, or active brand filters.",
  actionLabel = "Reset All Filters",
  onAction,
  icon: Icon = Car,
  className
}) {
  return (
    <div className={cn("text-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 max-w-xl mx-auto my-6 space-y-4", className)}>
      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto text-brand-600">
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-slate-900 font-display">{title}</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">{description}</p>
      </div>
      {onAction && actionLabel && (
        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

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
