import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input, Textarea } from './Input';
import { Select } from './Select';
import { useApp } from '../../context/AppContext';
import { Send, CheckCircle2, ShieldCheck, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/cn';
import confetti from 'canvas-confetti';

export function EnquiryModal({ isOpen, onClose, selectedCar }) {
  const { submitEnquiry, customerProfile, userRole, loginUser } = useApp();
  
  const [formData, setFormData] = useState({
    name: customerProfile?.name || 'John Smith',
    email: customerProfile?.email || 'user@speedxmotors.com',
    phone: customerProfile?.phone || '+1 (555) 234-5678',
    budget: '$500,000 - $1,000,000',
    tradeIn: 'No Trade-in',
    message: 'I am interested in acquiring this vehicle and would like to review the full provenance history, delivery options, and escrow terms.',
  });

  useEffect(() => {
    if (customerProfile) {
      setFormData(prev => ({
        ...prev,
        name: customerProfile.name || prev.name,
        email: customerProfile.email || prev.email,
        phone: customerProfile.phone || prev.phone
      }));
    }
  }, [customerProfile]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        carName: selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "General Collection",
        budget: formData.budget,
        message: `${formData.message} [Trade-in: ${formData.tradeIn}]`,
        isVip: true
      });
      setIsSubmitting(false);
      setSubmitted(true);
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 }
      });
    }, 600);
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
          ? "Inquiry Received" 
          : userRole === 'visitor' 
            ? "Account Required to Inquire" 
            : "Request Private Acquisition Consultation"
      }
      subtitle={selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "SPEEDX Private Client Advisory"}
      maxWidth="max-w-xl"
    >
      {submitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-slate-900 font-display">Concierge Alert Dispatched</h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Our Senior Dealership Director will connect with you via encrypted phone or email within <strong>2 hours</strong> with the provenance dossier, video walkthrough, and settlement terms.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            100% Confidential & KYC-Compliant
          </div>
          <Button variant="primary" onClick={handleClose} className="w-full font-black bg-amber-400 hover:bg-amber-300 text-slate-950">
            Back to Vehicle
          </Button>
        </div>
      ) : userRole === 'visitor' ? (
        <div className="py-4 space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-950 font-display">
              Create an Account to Consult & Acquire
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To request an official dossier, trade-in quote, or reserve {selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : 'this car'}, please create an account or sign in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            <Link
              to={`/register?bookCar=${selectedCar?.id || ''}`}
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </Link>

            <Link
              to={`/login?bookCar=${selectedCar?.id || ''}`}
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </div>

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
                className="py-2 px-3 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-white text-[11px] font-bold transition-all cursor-pointer text-center"
              >
                Sign In as Admin
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Smith"
            />
            <Input
              label="Contact Phone"
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              placeholder="10-digit number (e.g. 9876543210)"
            />
          </div>

          <Input
            label="Email Address"
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="user@speedxmotors.com"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Expected Budget / Financing"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              options={[
                'Cash Settlement / International Wire',
                'Cryptocurrency Escrow (BTC/USDC)',
                'Bespoke Exotic Lease',
                '$300k - $600k',
                '$600k - $1.5M',
                '$1.5M - $5M+'
              ]}
            />
            <Select
              label="Trade-in Consideration"
              value={formData.tradeIn}
              onChange={(e) => setFormData({ ...formData, tradeIn: e.target.value })}
              options={[
                'No Trade-in',
                'Trading Ferrari / Lamborghini',
                'Trading Porsche / McLaren',
                'Multi-Vehicle Collection Trade'
              ]}
            />
          </div>

          <Textarea
            label="Message or Specific Inquiries"
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Ask about delivery timelines, ceramic packages, or tax jurisdiction..."
          />

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting} icon={Send} className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black">
              Send Private Inquiry
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default EnquiryModal;
