import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({
  children,
  className,
  variant = 'default', // 'default' | 'primary' | 'success' | 'warning' | 'info' | 'dark' | 'outline' | 'amber'
  size = 'md', // 'sm' | 'md' | 'lg'
  dot = false,
  ...props
}) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    primary: "bg-brand-50 text-brand-700 border-brand-200 font-semibold",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    amber: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
    dark: "bg-slate-900 text-white border-slate-800",
    outline: "bg-transparent text-slate-700 border-slate-300",
  };

  const dotColors = {
    default: "bg-slate-400",
    primary: "bg-brand-600",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    amber: "bg-yellow-500",
    info: "bg-sky-500",
    dark: "bg-white",
    outline: "bg-slate-500",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 rounded-md",
    md: "text-xs px-2.5 py-1 rounded-lg",
    lg: "text-sm px-3.5 py-1.5 rounded-xl",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border uppercase tracking-wider",
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant] || dotColors.default)} />
      )}
      {children}
    </span>
  );
}
