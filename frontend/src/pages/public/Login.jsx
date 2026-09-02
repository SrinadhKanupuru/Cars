import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldCheck, User, ArrowRight, Lock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export function Login() {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || location.state?.redirect || '';
  const bookCarId = searchParams.get('bookCar') || location.state?.bookCar || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' | 'admin'
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePostLoginRedirect = (role) => {
    if (bookCarId) {
      navigate(`/inventory/${bookCarId}?openBooking=true`);
    } else if (redirectUrl) {
      navigate(redirectUrl);
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = await loginUser({ email, password, role: selectedRole });
    setIsLoading(false);

    if (res?.success) {
      handlePostLoginRedirect(res.role || selectedRole);
    } else {
      setErrorMessage(res?.message || 'Invalid email or password credentials. Please try again.');
    }
  };

  const handleQuickAdmin = async () => {
    setEmail('admin@speedxmotors.com');
    setPassword('admin');
    setSelectedRole('admin');
    setIsLoading(true);
    const res = await loginUser({ email: 'admin@speedxmotors.com', password: 'admin', role: 'admin' });
    setIsLoading(false);
    if (res?.success) {
      handlePostLoginRedirect('admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 sm:py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-7">
        
        {/* Brand Header */}
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
            Sign In to Your Account
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {bookCarId 
              ? "Sign in to complete your vehicle rental reservation and test drive schedule." 
              : "Sign in with your registered email and password to access your private garage and reservations."}
          </p>
        </div>

        {/* Standard Login Credentials Form */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-luxury space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Failed</p>
                <p className="text-rose-700 text-[11px] mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              required
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
              placeholder="Enter your registered email"
            />

            <Input
              label="Password"
              required
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
              placeholder="Enter your password"
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="md" 
              disabled={isLoading}
              icon={ArrowRight} 
              iconPosition="right" 
              className="w-full font-black bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          {/* Admin Quick Switch (Subtle) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>Sign in as Dealership Administrator (Admin Console)</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link 
              to={`/register${bookCarId ? `?bookCar=${bookCarId}` : redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`} 
              className="font-bold text-amber-600 hover:text-amber-700 underline ml-1"
            >
              Create New Customer Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
