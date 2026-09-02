import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by make, model, VIN, horsepower...",
  className,
  onClear,
  size = "md"
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Search className={size === "lg" ? "w-5 h-5 text-brand-600" : "w-4 h-4 text-slate-400"} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm",
          size === "lg" ? "py-3.5 text-base" : "py-2.5 text-sm"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear();
            else onChange('');
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
