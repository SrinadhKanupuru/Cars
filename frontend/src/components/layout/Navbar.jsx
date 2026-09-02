import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Heart, 
  Search, 
  User, 
  ShieldCheck, 
  ChevronDown, 
  LayoutDashboard,
  LogOut,
  Car
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { wishlist, userRole, setUserRole, customerProfile } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'INVENTORY', path: '/inventory' },
    { label: 'BRANDS', path: '/brands' },
    { label: 'SERVICES', path: '/services' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
  ];

  const handleLogout = () => {
    setUserRole('visitor');
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-950/95 backdrop-blur-xl shadow-xl shadow-black/40 py-3 border-b border-slate-800/80' 
        : 'bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-800/50'
    }`}>
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        
        {/* Brand Logo: SPEEDX MOTORS */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <span className="font-display font-black text-2xl tracking-tighter text-white">
            SPEED<span className="text-amber-400 italic">X</span>
          </span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase hidden sm:inline-block border-l border-slate-800 pl-2">
            MOTORS
          </span>
        </Link>

        {/* Desktop Navigation Links with Gold / Brand Indicator */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                  isActive ? 'text-amber-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-fade-in" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Icons & Auth Button */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <Link
            to="/inventory"
            className="p-2 text-slate-300 hover:text-amber-400 transition-colors"
            title="Search Inventory"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Wishlist Heart Icon */}
          <Link
            to="/customer/wishlist"
            className="relative p-2 text-slate-300 hover:text-amber-400 transition-colors"
            title="Saved Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-amber-400 text-slate-950 rounded-full text-[9px] font-black flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Login / Profile Dropdown */}
          {userRole === 'visitor' ? (
            <Link to="/login">
              <button
                type="button"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider px-5 py-2 rounded-full shadow-md shadow-amber-400/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer font-display"
              >
                <User className="w-3.5 h-3.5" />
                <span>LOGIN</span>
              </button>
            </Link>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-full border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-white transition-all text-xs font-bold"
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                  {userRole === 'admin' ? 'AD' : (customerProfile?.name ? customerProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'VIP')}
                </div>
                <span className="hidden sm:inline font-bold text-slate-200">
                  {userRole === 'admin' ? 'Admin' : (customerProfile?.name || 'My Account')}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-950 shadow-2xl border border-slate-800 p-2 z-50 animate-slide-up text-white"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <div className="p-3 border-b border-slate-800 mb-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">
                      {userRole === 'admin' ? 'Administrator' : (customerProfile?.name || 'Customer')}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {customerProfile?.email || ''}
                    </p>
                    <p className="text-[10px] text-amber-400 font-bold mt-0.5">
                      {userRole === 'admin' ? 'ADMIN CONSOLE' : (customerProfile?.membershipTier || 'VIP MEMBER')}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      Unified Dashboard
                    </Link>
                    <Link
                      to="/dashboard?tab=cars"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-amber-400" />
                      {userRole === 'admin' ? 'Fleet Management' : 'Browse Fleet'}
                    </Link>
                  </div>

                  <div className="pt-2 mt-1 border-t border-slate-800 flex items-center justify-between px-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                    <Link to="/login" className="text-xs font-semibold text-slate-400 hover:text-slate-200">
                      Switch
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-200 hover:bg-slate-900 lg:hidden"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown / Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-slide-up text-white">
          {/* User Info Bar if Logged In */}
          {userRole !== 'visitor' && (
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                  {userRole === 'admin' ? 'AD' : (customerProfile?.name ? customerProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'VIP')}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[150px]">
                    {userRole === 'admin' ? 'Administrator' : (customerProfile?.name || 'Customer')}
                  </h4>
                  <span className="text-[10px] font-bold text-amber-400 uppercase">
                    {userRole === 'admin' ? 'Admin Console' : (customerProfile?.membershipTier || 'VIP Member')}
                  </span>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 px-2.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black uppercase"
              >
                Dashboard
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold text-slate-300 hover:text-amber-400 hover:bg-slate-900/60 rounded-xl transition-colors uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Dashboard Direct Tabs if Logged In */}
          {userRole !== 'visitor' ? (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Unified Dashboard</span>
              </Link>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 px-1">
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Switch Account
                </Link>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                <Button variant="primary" size="sm" className="w-full font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs">
                  LOGIN / REGISTER
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
