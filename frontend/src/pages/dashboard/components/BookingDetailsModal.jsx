import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { formatPrice } from '../../../utils/cn';
import { 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Car as CarIcon,
  ShieldCheck,
  FileText
} from 'lucide-react';

export function BookingDetailsModal({ isOpen, onClose, booking, onCancelBooking, onCompleteBooking, isAdmin }) {
  if (!booking) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Approval
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider border border-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const calculateDays = () => {
    if (!booking.pickup_date || !booking.return_date) return 1;
    const start = new Date(booking.pickup_date);
    const end = new Date(booking.return_date);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const rentalDays = calculateDays();
  const dailyRate = booking.daily_rate || 1500;
  const estimatedCost = rentalDays * dailyRate;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`BOOKING DOSSIER • ${booking.booking_code || booking.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 pt-1">
        
        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/90">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Current Booking Status</span>
            <div className="mt-1">{getStatusBadge(booking.status)}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Created On</span>
            <span className="text-xs font-bold text-slate-700">
              {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'Recent'}
            </span>
          </div>
        </div>

        {/* Rejection Alert if Rejected */}
        {booking.status === 'Rejected' && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 text-xs">
            <div className="flex items-center gap-2 text-rose-800 font-black uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Dealership Rejection Reason</span>
            </div>
            <p className="text-rose-700 pl-6 leading-relaxed font-medium">
              {booking.rejection_reason || 'Vehicle allocation unavailable for requested dates. Please choose another vehicle or alternate schedule.'}
            </p>
          </div>
        )}

        {/* Vehicle Preview Card */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-full sm:w-36 h-24 rounded-xl overflow-hidden bg-slate-100 p-1 flex items-center justify-center shrink-0 border border-slate-200">
            <img
              src={booking.car_image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=400&q=80'}
              alt={booking.car_model}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 w-full space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">
              {booking.car_brand}
            </span>
            <h3 className="text-lg font-black text-slate-950 font-display">
              {booking.car_model}
            </h3>
            <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
              <span>Rate: <strong className="text-slate-900">{formatPrice(dailyRate)}/day</strong></span>
              <span>•</span>
              <span>Total ({rentalDays}d): <strong className="text-amber-600 font-bold">{formatPrice(estimatedCost)}</strong></span>
            </div>
          </div>
        </div>

        {/* Schedule & Pickup Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Rental Schedule</span>
            </div>
            <div className="space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Pickup Date:</span>
                <span className="font-bold text-slate-900">{booking.pickup_date}</span>
              </div>
              <div className="flex justify-between">
                <span>Return Date:</span>
                <span className="font-bold text-slate-900">{booking.return_date}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span>Duration:</span>
                <span className="font-bold text-amber-600">{rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Pickup Location</span>
            </div>
            <p className="font-bold text-slate-900 leading-snug">
              {booking.pickup_location || 'Beverly Hills Showroom Sanctuary'}
            </p>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>White-Glove Vehicle Handover</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Customer Contact</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="flex items-center gap-2 text-slate-800">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold truncate">{booking.user_name}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{booking.user_email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{booking.phone}</span>
            </div>
          </div>

          {booking.message && (
            <div className="pt-2 mt-2 border-t border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Customer Note:</span>
              <p className="text-slate-600 italic">"{booking.message}"</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-100">
          {booking.status === 'Pending' && onCancelBooking && (
            <button
              type="button"
              onClick={() => {
                onCancelBooking(booking.id);
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel Booking Request
            </button>
          )}

          {isAdmin && booking.status === 'Approved' && onCompleteBooking && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Mark rental for ${booking.car_brand} ${booking.car_model} as Completed and return vehicle to Available fleet?`)) {
                  onCompleteBooking(booking.id);
                  onClose();
                }
              }}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Rental Completed</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </Modal>
  );
}

export default BookingDetailsModal;
