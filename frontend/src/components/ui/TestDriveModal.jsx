import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { Button } from './Button';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, CheckCircle2, User, ShieldCheck, ArrowRight, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { formatPrice } from '../../utils/cn';
import confetti from 'canvas-confetti';

export function TestDriveModal({ isOpen, onClose, selectedCar }) {
  const { bookTestDrive, customerProfile, userRole, loginUser } = useApp();
  const navigate = useNavigate();

  const car = selectedCar || {
    id: '488-pista',
    brand: 'Ferrari',
    model: '488 Pista',
    price: 275000,
    engine: '3.9L V8 Engine',
    horsepower: 710,
    transmission: '7-Speed F1 Transmission',
    zeroToHundred: '0-100 km/h in 2.85s',
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80']
  };

  const [formData, setFormData] = useState({
    customerName: customerProfile?.name || 'John Smith',
    customerEmail: customerProfile?.email || 'user@speedxmotors.com',
    customerPhone: customerProfile?.phone || '+1 (555) 234-5678',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    notes: 'I would like to test drive this vehicle.',
  });

  useEffect(() => {
    if (customerProfile) {
      setFormData(prev => ({
        ...prev,
        customerName: customerProfile.name || prev.customerName,
        customerEmail: customerProfile.email || prev.customerEmail,
        customerPhone: customerProfile.phone || prev.customerPhone
      }));
    }
  }, [customerProfile]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      bookTestDrive({
        ...formData,
        carId: car.id,
        carName: `${car.brand} ${car.model}`
      });
      setIsSubmitting(false);
      setSubmitted(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 500);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  const handleQuickDemoLogin = (role) => {
    if (role === 'admin') {
      loginUser({ email: 'admin@speedxmotors.com', password: 'admin', role: 'admin' });
    } else {
      loginUser({ email: 'user@speedxmotors.com', password: 'user', role: 'customer' });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        submitted 
          ? "Booking Confirmed" 
          : userRole === 'visitor' 
            ? "Account Required to Book Vehicle" 
            : "SCHEDULE TEST DRIVE"
      }
      maxWidth="max-w-3xl"
    >
      {submitted ? (
        /* 1. Confirmed Success State */
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-slate-900 font-display">Test Drive Confirmed</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your appointment for the <strong>{car.brand} {car.model}</strong> on <strong>{formData.date} at {formData.timeSlot}</strong> is officially scheduled.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            RETURN TO SHOWROOM
          </button>
        </div>
      ) : userRole === 'visitor' ? (
        /* 2. Visitor Auth Gate: Prompt to Create Account or Login */
        <div className="py-4 space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-950 font-display">
              Create an Account to Book This {car.brand}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To schedule an official private test drive or reserve an allocation for the{' '}
              <strong className="text-slate-900">{car.brand} {car.model}</strong>, please create an account or sign in to your membership.
            </p>
          </div>

          {/* Car Mini Preview Card */}
          <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 max-w-md mx-auto">
            <img
              src={car.images?.[0] || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80'}
              alt={car.model}
              className="w-20 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">{car.brand}</span>
              <h4 className="font-bold text-slate-900 text-sm truncate">{car.model}</h4>
              <span className="text-xs font-black text-slate-950 font-display">{formatPrice(car.price)}</span>
            </div>
          </div>

          {/* Primary Action Buttons: Register & Login */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            <Link
              to={`/register?bookCar=${car.id}`}
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </Link>

            <Link
              to={`/login?bookCar=${car.id}`}
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Quick 1-Click Instant Demo Login inside modal */}
          <div className="pt-4 border-t border-slate-100 max-w-md mx-auto text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              ⚡ Or 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="py-2 px-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100/80 text-amber-800 text-[11px] font-bold transition-all cursor-pointer text-center"
              >
                Sign In as User
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-2 px-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all cursor-pointer text-center"
              >
                Sign In as Admin
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Logged-in Customer Booking Form */
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-1">
          
          {/* Left Column: Car Preview */}
          <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="h-36 rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center border border-slate-100">
              <img
                src={car.images?.[0] || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80'}
                alt={car.model}
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h3 className="text-base font-black font-display uppercase tracking-tight text-slate-950">
                {car.brand} {car.model}
              </h3>
              <p className="text-base font-black text-amber-600 mt-0.5">
                {formatPrice(car.price)}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">🏎️</span>
                <span>{car.engine || 'High-Performance Engine'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">⚡</span>
                <span>{car.horsepower} HP Output</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">⚙️</span>
                <span>{car.transmission || 'Dual-Clutch Transmission'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">⏱️</span>
                <span>{car.zeroToHundred || '0-100 km/h in 3.0s'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Scheduling Form */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Customer Information */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">YOUR INFORMATION</span>
              
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="John Smith"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="user@speedxmotors.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Phone Number (10 digits)</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit number (e.g. 9876543210)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Test Drive Details */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">TEST DRIVE DETAILS</span>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Preferred Time</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Message / Special Requests (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="I would like to test drive this vehicle on the private circuit."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 transition-all active:scale-95 text-center mt-2 cursor-pointer"
            >
              {isSubmitting ? 'PROCESSING...' : 'CONFIRM TEST DRIVE BOOKING'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default TestDriveModal;
