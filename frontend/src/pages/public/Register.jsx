import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ShieldCheck, CheckCircle2, ArrowRight, UserPlus, Sparkles } from 'lucide-react';

export function Register() {
  const { registerUser } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookCarId = searchParams.get('bookCar') || '';
  const redirectUrl = searchParams.get('redirect') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    membershipTier: 'Platinum VIP Member',
    preferredBrand: 'Ferrari'
  });

  const [phoneError, setPhoneError] = useState('');

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: digitsOnly }));
    if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      setPhoneError(`${10 - digitsOnly.length} more digits needed (10 digits required)`);
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = (formData.phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return;
    }

    const res = await registerUser({
      name: formData.name,
      email: formData.email,
      phone: cleanPhone,
      password: formData.password || 'user',
      membershipTier: formData.membershipTier,
      preferredBrand: formData.preferredBrand
    });

    if (res?.success) {
      if (bookCarId) {
        navigate(`/inventory/${bookCarId}?openBooking=true`);
      } else if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 sm:py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-7">
        
        {/* Header */}
        <div className="text-center space-y-2.5">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <span className="font-display font-black text-3xl tracking-tighter text-slate-950">
              SPEED<span className="text-amber-500 italic">X</span>
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase border-l border-slate-300 pl-2">
              MOTORS
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
            Create Customer Account
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {bookCarId 
              ? "Create your account to book test drives, reserve allocations, and purchase vehicles." 
              : "Register to access your private garage, vehicle test drives, and showroom allocations."}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-luxury space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alexander Vance"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alexander@domain.com"
              />
              <Input
                label="Phone Number"
                required
                type="tel"
                inputMode="numeric"
                maxLength={10}
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="10-digit number (e.g. 9876543210)"
                error={phoneError}
                helperText={!phoneError && formData.phone.length === 10 ? "✓ 10 digits entered" : ""}
              />
            </div>

            <Input
              label="Password"
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a secure password"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Membership Level"
                value={formData.membershipTier}
                onChange={(e) => setFormData({ ...formData, membershipTier: e.target.value })}
                options={[
                  'Platinum VIP Member',
                  'Diamond Collector Club',
                  'Private Garage Tier'
                ]}
              />
              <Select
                label="Preferred Brand"
                value={formData.preferredBrand}
                onChange={(e) => setFormData({ ...formData, preferredBrand: e.target.value })}
                options={[
                  'Ferrari',
                  'Porsche',
                  'Lamborghini',
                  'McLaren',
                  'Aston Martin',
                  'Toyota',
                  'Tesla'
                ]}
              />
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant access to schedule VIP vehicle test drives</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Track allocation status & verified digital provenance</span>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="md" 
              icon={ArrowRight} 
              iconPosition="right" 
              className="w-full font-black bg-amber-400 hover:bg-amber-300 text-slate-950"
            >
              {bookCarId ? "Create Account & Continue Booking" : "Create Account & Enter Showroom"}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link 
              to={`/login${bookCarId ? `?bookCar=${bookCarId}` : redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`} 
              className="font-bold text-amber-600 hover:text-amber-700 underline"
            >
              Sign In Here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
