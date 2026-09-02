import React from 'react';
import { cn } from '../../utils/cn';
import { Car } from 'lucide-react';
import { Button } from './Button';

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

export default EmptyState;
