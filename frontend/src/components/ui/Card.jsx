import React from 'react';
import { cn } from '../../utils/cn';

export function Card({
  children,
  className,
  hover = true,
  interactive = false,
  glass = false,
  dark = false,
  ...props
}) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300 relative",
        dark 
          ? "bg-slate-900 text-white border border-slate-800" 
          : glass 
            ? "glass-card text-slate-900" 
            : "bg-white text-slate-900 border border-slate-100 shadow-luxury",
        hover && "hover:shadow-luxury-hover hover:-translate-y-1",
        interactive && "cursor-pointer active:scale-[0.99]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("p-6 pb-4 border-b border-slate-100 flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn("text-lg font-bold text-slate-900 font-display tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn("p-6 pt-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl", className)} {...props}>
      {children}
    </div>
  );
}
