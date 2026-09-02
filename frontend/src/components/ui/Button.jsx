import React from 'react';
import { cn } from '../../utils/cn';

export function Button({
  children,
  className,
  variant = 'primary', // 'primary' | 'dark' | 'outline' | 'ghost' | 'danger' | 'white'
  size = 'md', // 'sm' | 'md' | 'lg' | 'icon'
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 focus:ring-brand-500",
    dark: "bg-slate-950 hover:bg-slate-900 text-white shadow-md hover:shadow-xl focus:ring-slate-900 border border-slate-800",
    outline: "border-2 border-slate-200 hover:border-slate-900 text-slate-800 hover:text-slate-950 bg-transparent hover:bg-slate-50 focus:ring-slate-400",
    outlineRed: "border-2 border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-400",
    ghost: "text-slate-600 hover:text-slate-950 hover:bg-slate-100 focus:ring-slate-300",
    ghostRed: "text-brand-600 hover:text-brand-700 hover:bg-brand-50 focus:ring-brand-300",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-md focus:ring-rose-500",
    white: "bg-white text-slate-900 hover:bg-slate-50 shadow-luxury focus:ring-slate-200 border border-slate-100",
  };

  const sizes = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3.5 gap-2.5 font-semibold",
    icon: "p-2.5 aspect-square rounded-xl",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={cn("shrink-0", size === 'sm' ? "w-4 h-4" : size === 'lg' ? "w-5 h-5" : "w-4.5 h-4.5")} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={cn("shrink-0", size === 'sm' ? "w-4 h-4" : size === 'lg' ? "w-5 h-5" : "w-4.5 h-4.5")} />}
        </>
      )}
    </button>
  );
}
