import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { Button } from './Button';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Car,
  UserPlus,
  LogIn
} from 'lucide-react';
import { formatPrice } from '../../utils/cn';
import confetti from 'canvas-confetti';

export function RentalBookingModal({ isOpen, onClose, selectedCar, onBookingSuccess }) {
  const { 
    createRentalBooking, 
    checkBookingOverlap, 
    customerProfile, 
    userRole, 
    loginUser, 
    showToast 
  } = useApp();
  const navigate = useNavigate();

  const car = selectedCar || {
    id: '488-pista',
    brand: 'Ferrari',
    model: '488 Pista',
    price: 275000,
    daily_rate: 1850,
    engine: '3.9L V8 Twin-Turbo',
    horsepower: 710,
    transmission: '7-Speed F1 Dual-Clutch',
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80']
  };

  const dailyRate = car.daily_rate || (car.price ? Math.round(car.price / 160) : 1500);

  // Defaults: Pickup tomorrow, return 4 days later
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getFourDaysStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    customerName: customerProfile?.name || 'John Smith',
    customerEmail: customerProfile?.email || 'user@speedxmotors.com',
    customerPhone: customerProfile?.phone || '+1 (555) 234-5678',
    pickupDate: getTomorrowStr(),
    returnDate: getFourDaysStr(),
    pickupLocation: 'Beverly Hills Showroom Sanctuary',
    message: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);

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

  useEffect(() => {
    setErrorMessage('');
  }, [formData.pickupDate, formData.returnDate, car.id]);

  // Calculate rental duration in days
  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 1;
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.returnDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const rentalDays = calculateDays();
  const totalRentalCost = rentalDays * dailyRate;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Check date order
    if (new Date(formData.pickupDate) > new Date(formData.returnDate)) {
      setErrorMessage("Return date cannot be earlier than pickup date.");
      return;
    }

    // Check overlap
    const isOverlapped = checkBookingOverlap(car.id, formData.pickupDate, formData.returnDate);
    if (isOverlapped) {
      setErrorMessage("This car is already booked for the selected dates. Please choose another date or car.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = createRentalBooking({
        carId: car.id,
        carName: `${car.brand} ${car.model}`,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        pickupLocation: formData.pickupLocation,
        message: formData.message
      });

      setIsSubmitting(false);

      if (res.success) {
        setSubmittedBooking(res.booking);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (onBookingSuccess) onBookingSuccess(res.booking);
      } else {
        setErrorMessage(res.message);
      }
    }, 450);
  };

  const handleClose = () => {
    setSubmittedBooking(null);
    setErrorMessage('');
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
        submittedBooking
          ? "Booking Request Submitted"
          : userRole === 'visitor'
            ? "Account Required to Book Vehicle"
            : `RESERVE ${car.brand?.toUpperCase()} ${car.model?.toUpperCase()}`
      }
      maxWidth="max-w-3xl"
    >
      {submittedBooking ? (
        /* 1. Submitted Waiting for Approval State */
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border-2 border-amber-300 shadow-sm animate-bounce">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider">
              Status: Pending Approval
            </div>
            <h4 className="text-2xl font-black text-slate-950 font-display">
              Booking Request Submitted Successfully
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Waiting for admin approval. You will receive a notification as soon as our dealership concierge reviews your request.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2.5 text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Booking Reference:</span>
              <span className="font-mono font-bold text-slate-900">{submittedBooking.booking_code || submittedBooking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Vehicle:</span>
              <span className="font-bold text-slate-900">{submittedBooking.car_brand} {submittedBooking.car_model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Schedule:</span>
              <span className="font-bold text-slate-900">{submittedBooking.pickup_date} → {submittedBooking.return_date} ({rentalDays} Days)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Pickup Location:</span>
              <span className="font-bold text-slate-900 truncate max-w-[200px]">{submittedBooking.pickup_location}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
              <span className="font-bold text-slate-700">Estimated Total:</span>
              <span className="font-black text-amber-600 font-display">{formatPrice(totalRentalCost)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
            <button
              type="button"
              onClick={() => {
                handleClose();
                navigate('/dashboard?tab=my-bookings');
              }}
              className="py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer text-center"
            >
              Go to My Bookings
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
            >
              Close & Browse
            </button>
          </div>
        </div>
      ) : userRole === 'visitor' ? (
        /* 2. Visitor Auth Gate */
        <div className="py-4 space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-950 font-display">
              Create an Account to Book This Vehicle
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To submit a rental booking for the <strong className="text-slate-900">{car.brand} {car.model}</strong>, please create an account or sign in.
            </p>
          </div>

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

          <div className="pt-4 border-t border-slate-100 max-w-md mx-auto text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              ⚡ Quick Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="py-2 px-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100/80 text-amber-800 text-[11px] font-bold transition-all cursor-pointer"
              >
                Sign In as User
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-2 px-3 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-white text-[11px] font-bold transition-all cursor-pointer"
              >
                Sign In as Admin
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Interactive Rental Booking Form */
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-1">
          
          {/* Left Column: Car Preview & Rate Calculator */}
          <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-36 rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center border border-slate-200 shadow-2xs">
                <img
                  src={car.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80'}
                  alt={car.model}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">{car.brand}</span>
                <h3 className="text-lg font-black font-display uppercase tracking-tight text-slate-950">
                  {car.model}
                </h3>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Daily Rental Rate:</span>
                  <span className="font-bold text-slate-900">{formatPrice(dailyRate)} / day</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Duration:</span>
                  <span className="font-bold text-slate-900">{rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200/60 font-black text-sm text-slate-950">
                  <span>Total Estimate:</span>
                  <span className="text-amber-600 font-display">{formatPrice(totalRentalCost)}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Includes zero-deductible track & road insurance with VIP 24/7 recovery.</span>
            </div>
          </div>

          {/* Right Column: Date Picker & Customer Details */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Overlap Error Alert */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* RENTAL SCHEDULE */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                RENTAL SCHEDULE
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Pickup Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Return Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* PICKUP LOCATION */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-600 block">Pickup & Return Location *</label>
              <select
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="Beverly Hills Showroom Sanctuary">Beverly Hills Showroom Sanctuary</option>
                <option value="Los Angeles International Airport (VIP Valet)">Los Angeles International Airport (VIP Valet)</option>
                <option value="Miami Private Helipad & Marina">Miami Private Helipad & Marina</option>
                <option value="Monaco Hotel de Paris Port Delivery">Monaco Hotel de Paris Port Delivery</option>
                <option value="Geneva Private Jet Terminal">Geneva Private Jet Terminal</option>
                <option value="Private Residence / Escrow Delivery">Private Residence / Escrow Delivery</option>
              </select>
            </div>

            {/* CUSTOMER INFO */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                RENTER DETAILS
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Contact Phone (10 digits)</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit number (e.g. 9876543210)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Special Requests (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Flight arrival info, luggage transfer, or track helmet preferences..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <span>CHECKING ALLOCATION & SUBMITTING...</span>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>SUBMIT BOOKING REQUEST (PENDING APPROVAL)</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default RentalBookingModal;
