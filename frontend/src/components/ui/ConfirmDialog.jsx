import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // "danger" | "primary" | "warning"
  loading = false,
}) {
  const icons = {
    danger: <AlertTriangle className="w-10 h-10 text-rose-600 bg-rose-50 p-2 rounded-2xl" />,
    warning: <AlertTriangle className="w-10 h-10 text-amber-600 bg-amber-50 p-2 rounded-2xl" />,
    primary: <Info className="w-10 h-10 text-brand-600 bg-brand-50 p-2 rounded-2xl" />,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={false}>
      <div className="text-center py-2 space-y-4">
        <div className="flex justify-center">
          {icons[variant] || icons.primary}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 font-display">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={loading} className="w-1/2">
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            className="w-1/2"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
