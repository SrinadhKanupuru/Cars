import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { AlertCircle, XCircle } from 'lucide-react';

export function RejectBookingDialog({ isOpen, onClose, booking, onConfirmReject }) {
  const [reason, setReason] = useState('Vehicle allocation unavailable for requested dates.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmReject(booking.id, reason);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="REJECT BOOKING REQUEST"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              Rejecting request for {booking.car_brand} {booking.car_model}
            </p>
            <p className="text-rose-700 text-[11px] mt-0.5">
              Customer: {booking.user_name} ({booking.pickup_date} → {booking.return_date})
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Reason for Rejection (Visible to Customer) *
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Vehicle scheduled for factory maintenance or track calibration..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default RejectBookingDialog;
