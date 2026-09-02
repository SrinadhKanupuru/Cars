import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  showClose = true,
  className
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 md:p-6 text-center">
        <div 
          className={cn(
            "relative w-full max-h-[92vh] flex flex-col transform rounded-2xl sm:rounded-3xl bg-white text-left shadow-2xl transition-all animate-slide-up border border-slate-200/90 overflow-hidden my-auto",
            maxWidth,
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-start justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
              <div className="pr-2">
                {title && <h3 className="text-base sm:text-xl font-bold text-slate-950 font-display leading-snug">{title}</h3>}
                {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1.5 sm:p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors focus:outline-none shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
