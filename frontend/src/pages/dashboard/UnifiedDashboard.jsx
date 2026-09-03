import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/cn';

// Subcomponents & Modals
import { BookingDetailsModal } from './components/BookingDetailsModal';
import { RejectBookingDialog } from './components/RejectBookingDialog';
import { AddEditCarModal } from './components/AddEditCarModal';
import { RentalBookingModal } from '../../components/ui/RentalBookingModal';

// Lucide Icons
import {
  LayoutDashboard,
  Car,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  Bell,
  User,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Eye,
  SlidersHorizontal,
  Check,
  MapPin,
  RefreshCw,
  Phone,
  Mail,
  Zap,
  TrendingUp,
  Tag
} from 'lucide-react';

export function UnifiedDashboard() {
  const {
    userRole,
    setUserRole,
    customerProfile,
    updateUserProfile,
    cars,
    addCar,
    updateCar,
    deleteCar,
    bookings,
    approveRentalBooking,
    rejectRentalBooking,
    completeRentalBooking,
    cancelRentalBooking,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    registeredUsers,
    logoutUser,
    showToast
  } = useApp();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab state
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(() => {
    if (tabParam) return tabParam;
    return 'overview';
  });

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  useEffect(() => {
    if (userRole === 'visitor') {
      navigate('/login?redirect=/dashboard');
    }
  }, [userRole, navigate]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setIsMobileMenuOpen(false);
  };

  // Mobile sidebar state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Global search inside dashboard
  const [globalSearch, setGlobalSearch] = useState('');

  // Modals state
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
  const [selectedBookingForReject, setSelectedBookingForReject] = useState(null);
  const [carForRentalBooking, setCarForRentalBooking] = useState(null);
  const [carToEdit, setCarToEdit] = useState(null);
  const [isAddEditCarModalOpen, setIsAddEditCarModalOpen] = useState(false);

  // Table filter states
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  const [carBrandFilter, setCarBrandFilter] = useState('All');
  const [notificationFilter, setNotificationFilter] = useState('All'); // 'All' | 'Unread'

  // Profile Form state
  const [profileFormData, setProfileFormData] = useState({
    name: customerProfile?.name || '',
    email: customerProfile?.email || '',
    phone: customerProfile?.phone || '',
    membershipTier: customerProfile?.membershipTier || 'Platinum VIP Member'
  });

  useEffect(() => {
    if (customerProfile) {
      setProfileFormData({
        name: customerProfile.name || '',
        email: customerProfile.email || '',
        phone: customerProfile.phone || '',
        membershipTier: customerProfile.membershipTier || 'Platinum VIP Member'
      });
    }
  }, [customerProfile]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile(profileFormData);
  };

  const isAdmin = userRole === 'admin';

  // =========================================================================
  // 1. DATA COMPUTATIONS & STATISTICS
  // =========================================================================

  // User's specific bookings
  const myBookings = useMemo(() => {
    return bookings.filter(b => 
      b.user_email?.toLowerCase() === (customerProfile?.email || 'user@speedxmotors.com').toLowerCase() ||
      b.user_id === (customerProfile?.id || 'user-1')
    );
  }, [bookings, customerProfile]);

  // User Statistics
  const userStats = useMemo(() => {
    const total = myBookings.length;
    const pending = myBookings.filter(b => b.status === 'Pending').length;
    const approved = myBookings.filter(b => b.status === 'Approved').length;
    const rejected = myBookings.filter(b => b.status === 'Rejected').length;
    const completed = myBookings.filter(b => b.status === 'Completed').length;
    return { total, pending, approved, rejected, completed };
  }, [myBookings]);

  // Admin Statistics
  const adminStats = useMemo(() => {
    const totalCars = cars.length;
    const availableCars = cars.filter(c => c.availability === 'Available' || !c.availability).length;
    const totalBookings = bookings.length;
    const pendingRequests = bookings.filter(b => b.status === 'Pending').length;
    const approvedBookings = bookings.filter(b => b.status === 'Approved').length;
    const totalUsers = registeredUsers.length;
    return { totalCars, availableCars, totalBookings, pendingRequests, approvedBookings, totalUsers };
  }, [cars, bookings, registeredUsers]);

  // Role-relevant notifications with strict separation
  const relevantNotifications = useMemo(() => {
    if (isAdmin) {
      return notifications.filter(n => 
        n.target_role === 'admin' ||
        n.type === 'BOOKING_REQUEST' ||
        n.type === 'BOOKING_CANCELLED' ||
        n.type === 'TEST_DRIVE' ||
        n.type === 'LEAD' ||
        n.user_email?.toLowerCase() === 'admin@speedxmotors.com' ||
        n.user_id === 'admin-1'
      );
    }
    const currentEmail = (customerProfile?.email || 'user@speedxmotors.com').toLowerCase();
    const currentId = customerProfile?.id || 'user-1';
    return notifications.filter(n => 
      n.target_role === 'customer' && (
        n.user_email?.toLowerCase() === currentEmail ||
        n.user_id === currentId ||
        !n.user_email
      )
    );
  }, [notifications, isAdmin, customerProfile]);

  const unreadNotifsCount = useMemo(() => {
    return relevantNotifications.filter(n => !n.is_read).length;
  }, [relevantNotifications]);

  // Pending Booking Requests for Admin
  const pendingBookingRequests = useMemo(() => {
    return bookings.filter(b => b.status === 'Pending');
  }, [bookings]);

  // Filtered Cars for Browse / Manage Cars
  const filteredCars = useMemo(() => {
    return cars.filter(c => {
      const matchSearch = globalSearch === '' || 
        c.brand?.toLowerCase().includes(globalSearch.toLowerCase()) || 
        c.model?.toLowerCase().includes(globalSearch.toLowerCase());
      const matchBrand = carBrandFilter === 'All' || c.brand?.toLowerCase() === carBrandFilter.toLowerCase();
      return matchSearch && matchBrand;
    });
  }, [cars, globalSearch, carBrandFilter]);

  // Filtered Bookings for My Bookings / All Bookings
  const filteredBookings = useMemo(() => {
    const sourceList = isAdmin ? bookings : myBookings;
    return sourceList.filter(b => {
      const matchStatus = bookingStatusFilter === 'All' || b.status?.toLowerCase() === bookingStatusFilter.toLowerCase();
      const matchSearch = globalSearch === '' ||
        b.booking_code?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        b.car_brand?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        b.car_model?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        b.user_name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        b.pickup_location?.toLowerCase().includes(globalSearch.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [isAdmin, bookings, myBookings, bookingStatusFilter, globalSearch]);

  // All unique brands in fleet
  const fleetBrands = useMemo(() => {
    return Array.from(new Set(cars.map(c => c.brand))).filter(Boolean);
  }, [cars]);

  // Clean Date Formatter for ISO timestamps and date strings
  const formatBookingDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const raw = String(dateStr).split('T')[0];
      const parts = raw.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      }
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? raw : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return String(dateStr).split('T')[0];
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider border border-emerald-200 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider border border-amber-200 whitespace-nowrap">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-black uppercase tracking-wider border border-rose-200 whitespace-nowrap">
            <XCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider border border-slate-300 whitespace-nowrap">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Nav Items Definitions based on role
  const navItems = useMemo(() => {
    if (isAdmin) {
      return [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'cars', label: 'Cars Management', icon: Car, count: cars.length },
        { id: 'booking-requests', label: 'Booking Requests', icon: Clock, count: adminStats.pendingRequests, highlight: adminStats.pendingRequests > 0 },
        { id: 'all-bookings', label: 'All Bookings', icon: Calendar, count: bookings.length },
        { id: 'users', label: 'Users', icon: Users, count: registeredUsers.length },
        { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifsCount, highlight: unreadNotifsCount > 0 },
        { id: 'profile', label: 'Profile', icon: User }
      ];
    } else {
      return [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'cars', label: 'Browse Cars', icon: Car, count: cars.length },
        { id: 'my-bookings', label: 'My Bookings', icon: Calendar, count: myBookings.length },
        { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifsCount, highlight: unreadNotifsCount > 0 },
        { id: 'profile', label: 'Profile', icon: User }
      ];
    }
  }, [isAdmin, cars.length, adminStats.pendingRequests, bookings.length, registeredUsers.length, unreadNotifsCount, myBookings.length]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* ===================================================================== */}
      {/* TOP UNIFIED HEADER BAR */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-display font-black text-2xl tracking-tighter text-white">
                SPEED<span className="text-amber-400 italic">X</span>
              </span>
              <span className="hidden sm:inline text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase border-l border-slate-700 pl-2">
                RENTALS
              </span>
            </Link>

            {/* Role Badge Indicator */}
            <div className="hidden md:flex items-center gap-1.5 ml-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-slate-800 bg-slate-900">
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400">Admin Console</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-300">VIP Customer</span>
                </>
              )}
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder={isAdmin ? "Search bookings, cars, users..." : "Search cars, models, bookings..."}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
              />
              {globalSearch && (
                <button
                  type="button"
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Header Controls: Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Main Website Link */}
            <Link
              to="/"
              className="hidden lg:inline-flex text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-colors"
            >
              Public Showroom
            </Link>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotifDropdownOpen(!isNotifDropdownOpen);
                  setIsProfileDropdownOpen(false);
                }}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center shadow-xs animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotifDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-slide-up text-slate-200 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-white uppercase text-[11px] tracking-wider">Notifications</span>
                      {unreadNotifsCount > 0 && (
                        <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-400 text-[10px] font-black rounded-full">
                          {unreadNotifsCount} unread
                        </span>
                      )}
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsAsRead()}
                        className="text-[10px] font-bold text-amber-400 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                    {relevantNotifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      relevantNotifications.slice(0, 8).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.booking_id) {
                              handleTabChange(isAdmin ? 'all-bookings' : 'my-bookings');
                              const targetB = bookings.find(b => b.id === notif.booking_id || b.booking_code === notif.booking_id);
                              if (targetB) setSelectedBookingForDetails(targetB);
                            }
                            setIsNotifDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            notif.is_read 
                              ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60' 
                              : 'bg-amber-950/20 border-amber-500/40 text-slate-200 hover:bg-amber-950/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className={`font-bold text-[11px] ${notif.is_read ? 'text-slate-300' : 'text-amber-400'}`}>
                              {notif.title}
                            </h5>
                            {!notif.is_read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        handleTabChange('notifications');
                        setIsNotifDropdownOpen(false);
                      }}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      View All Notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  setIsNotifDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all text-xs font-bold text-white cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">
                  {isAdmin ? 'AD' : (customerProfile?.name ? customerProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'VIP')}
                </div>
                <span className="hidden md:inline font-bold truncate max-w-[120px]">
                  {isAdmin ? 'Admin' : (customerProfile?.name || 'Customer')}
                </span>
              </button>

              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-slide-up text-white text-xs"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="p-2.5 border-b border-slate-800 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                    <p className="font-bold text-white truncate">{customerProfile?.name || 'Customer'}</p>
                    <p className="text-[10px] text-amber-400 font-bold mt-0.5 uppercase">
                      {isAdmin ? 'Dealership Administrator' : 'VIP Customer'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTabChange('profile')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 rounded-xl transition-colors text-left mt-1 border-t border-slate-800 pt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN DASHBOARD BODY (SIDEBAR + CONTENT) */}
      {/* ===================================================================== */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
        
        {/* =================================================================== */}
        {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
        {/* =================================================================== */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200/90 p-4 flex flex-col justify-between shrink-0 shadow-sm transition-transform duration-300
            ${isMobileMenuOpen ? 'translate-x-0 top-16 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="space-y-6">
            
            {/* User Session Mini Profile Badge in Sidebar */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                {isAdmin ? 'AD' : (customerProfile?.name ? customerProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'VIP')}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs truncate">
                  {isAdmin ? 'Administrator' : (customerProfile?.name || 'Customer')}
                </h4>
                <span className="text-[10px] font-bold text-amber-600 block uppercase tracking-wider">
                  {isAdmin ? 'Admin Console' : (customerProfile?.membershipTier || 'VIP Member')}
                </span>
              </div>
            </div>

            {/* Nav Menu Items */}
            <nav className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-3 mb-2">
                {isAdmin ? 'Dealership Management' : 'Customer Portal'}
              </span>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-slate-950 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                        item.highlight 
                          ? 'bg-amber-400 text-slate-950 animate-pulse'
                          : isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Controls */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition-all cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile backdrop overlay */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/50 z-20 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* =================================================================== */}
        {/* MAIN DASHBOARD CONTENT STAGE */}
        {/* =================================================================== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">

          {/* ================================================================= */}
          {/* VIEW 1: OVERVIEW TAB */}
          {/* ================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Page Title & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                    {isAdmin ? "Dealership Business Overview" : `Welcome Back, ${customerProfile?.name || 'VIP Client'}`}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isAdmin 
                      ? "Real-time rental requests, vehicle availability, and fleet operations." 
                      : "Manage your luxury car reservations, track booking approvals, and schedule new hires."}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCarToEdit(null);
                        setIsAddEditCarModalOpen(true);
                      }}
                      className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Vehicle</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTabChange('cars')}
                      className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Car className="w-4 h-4" />
                      <span>Browse Cars Fleet</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* STATS CARDS: ROLE-BASED */}
              {/* ------------------------------------------------------------- */}
              {isAdmin ? (
                /* Admin Business Statistics */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Fleet</span>
                    <p className="text-2xl font-black text-slate-950 font-display">{adminStats.totalCars}</p>
                    <span className="text-[10px] text-slate-500 font-semibold">Exotic Vehicles</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Available Cars</span>
                    <p className="text-2xl font-black text-emerald-600 font-display">{adminStats.availableCars}</p>
                    <span className="text-[10px] text-emerald-700/80 font-semibold">Ready for Hire</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                    <p className="text-2xl font-black text-slate-950 font-display">{adminStats.totalBookings}</p>
                    <span className="text-[10px] text-slate-500 font-semibold">All Time Records</span>
                  </div>

                  <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
                    adminStats.pendingRequests > 0 
                      ? 'bg-amber-50/80 border-amber-300' 
                      : 'bg-white border-slate-200/90'
                  }`}>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
                      {adminStats.pendingRequests > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
                      Pending Requests
                    </span>
                    <p className="text-2xl font-black text-amber-700 font-display">{adminStats.pendingRequests}</p>
                    <span className="text-[10px] text-amber-800 font-semibold">Action Required</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Approved Bookings</span>
                    <p className="text-2xl font-black text-emerald-600 font-display">{adminStats.approvedBookings}</p>
                    <span className="text-[10px] text-slate-500 font-semibold">Confirmed Hires</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
                    <p className="text-2xl font-black text-slate-950 font-display">{adminStats.totalUsers}</p>
                    <span className="text-[10px] text-slate-500 font-semibold">Registered Clients</span>
                  </div>
                </div>
              ) : (
                /* Normal User Booking Statistics */
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">My Bookings</span>
                    <p className="text-2xl font-black text-slate-950 font-display">{userStats.total}</p>
                    <span className="text-[10px] text-slate-500 font-semibold">Total Reservations</span>
                  </div>

                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">🟡 Pending</span>
                    <p className="text-2xl font-black text-amber-700 font-display">{userStats.pending}</p>
                    <span className="text-[10px] text-amber-700/80 font-semibold">Waiting for Approval</span>
                  </div>

                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">🟢 Approved</span>
                    <p className="text-2xl font-black text-emerald-700 font-display">{userStats.approved}</p>
                    <span className="text-[10px] text-emerald-700/80 font-semibold">Confirmed Hire</span>
                  </div>

                  <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">🔴 Rejected</span>
                    <p className="text-2xl font-black text-rose-700 font-display">{userStats.rejected}</p>
                    <span className="text-[10px] text-rose-700/80 font-semibold">Allocation Declined</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">⚪ Completed</span>
                    <p className="text-2xl font-black text-slate-800 font-display">{userStats.completed}</p>
                    <span className="text-[10px] text-slate-500 font-semibold">Past Experiences</span>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SECTION: ADMIN PENDING BOOKING REQUESTS (If Admin) */}
              {/* ------------------------------------------------------------- */}
              {isAdmin && (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-500" />
                      <h3 className="font-bold text-slate-950 text-base font-display">
                        Recent Booking Requests ({pendingBookingRequests.length})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange('booking-requests')}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <span>Manage All Requests</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {pendingBookingRequests.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      <p className="font-bold text-slate-700">All caught up!</p>
                      <p className="text-slate-400 mt-0.5">No pending car booking requests awaiting approval.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <th className="py-2.5 px-3">Booking ID</th>
                            <th className="py-2.5 px-3">Customer</th>
                            <th className="py-2.5 px-3">Vehicle</th>
                            <th className="py-2.5 px-3">Schedule</th>
                            <th className="py-2.5 px-3">Location</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {pendingBookingRequests.slice(0, 5).map(booking => (
                            <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-slate-900">
                                {booking.booking_code || booking.id}
                              </td>
                              <td className="py-3 px-3">
                                <p className="font-bold text-slate-900">{booking.user_name}</p>
                                <p className="text-[10px] text-slate-400">{booking.phone}</p>
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-bold text-amber-600 block">{booking.car_brand}</span>
                                <span className="text-slate-900 font-semibold">{booking.car_model}</span>
                              </td>
                              <td className="py-3 px-3 font-semibold text-slate-700">
                                {booking.pickup_date} → {booking.return_date}
                              </td>
                              <td className="py-3 px-3 text-slate-600 max-w-[150px] truncate">
                                {booking.pickup_location}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedBookingForDetails(booking)}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                                    title="View Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => approveRentalBooking(booking.id)}
                                    className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-xs cursor-pointer"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedBookingForReject(booking)}
                                    className="py-1 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] shadow-xs cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SECTION: RECENT BOOKINGS & RECENT NOTIFICATIONS (Grid) */}
              {/* ------------------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left (8 Cols): Recent Bookings */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-500" />
                      <h3 className="font-bold text-slate-950 text-base font-display">
                        {isAdmin ? "Recent Fleet Bookings" : "My Recent Bookings"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange(isAdmin ? 'all-bookings' : 'my-bookings')}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {(isAdmin ? bookings : myBookings).length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs space-y-2">
                      <Car className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-700">No bookings recorded yet</p>
                      {!isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleTabChange('cars')}
                          className="py-2 px-4 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs mt-2"
                        >
                          Book Your First Car
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(isAdmin ? bookings : myBookings).slice(0, 4).map(booking => (
                        <div
                          key={booking.id}
                          className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3.5">
                            <img
                              src={booking.car_image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=300&q=80'}
                              alt={booking.car_model}
                              className="w-14 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-xs">
                                  {booking.car_brand} {booking.car_model}
                                </span>
                                {renderStatusBadge(booking.status)}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {booking.pickup_date} → {booking.return_date} • {booking.pickup_location?.split(' ')?.[0] || 'Showroom'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                            <span className="font-mono text-[11px] font-bold text-slate-400">
                              {booking.booking_code || booking.id}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForDetails(booking)}
                              className="py-1.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all shadow-2xs"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right (4 Cols): Recent Notifications Feed */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-500" />
                      <h3 className="font-bold text-slate-950 text-base font-display">Notifications</h3>
                    </div>
                    {unreadNotifsCount > 0 && (
                      <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        {unreadNotifsCount} new
                      </span>
                    )}
                  </div>

                  {relevantNotifications.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No notifications yet.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {relevantNotifications.slice(0, 5).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.booking_id) {
                              handleTabChange(isAdmin ? 'all-bookings' : 'my-bookings');
                              const targetB = bookings.find(b => b.id === notif.booking_id || b.booking_code === notif.booking_id);
                              if (targetB) setSelectedBookingForDetails(targetB);
                            }
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                            notif.is_read 
                              ? 'bg-slate-50/60 border-slate-100 text-slate-600 hover:bg-slate-100/60' 
                              : 'bg-amber-50/80 border-amber-200 text-slate-900 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <h5 className="font-bold text-xs text-slate-900">{notif.title}</h5>
                            {!notif.is_read && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleTabChange('notifications')}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700"
                    >
                      Open Full Notification Center →
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 2: CARS TAB (Browse Cars for User / Cars Management for Admin) */}
          {/* ================================================================= */}
          {activeTab === 'cars' && (
            <div className="space-y-6 animate-fade-in">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                    {isAdmin ? "Cars Fleet Management" : "Browse Supercars & Luxury Fleet"}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isAdmin 
                      ? "Add, edit, manage pricing, and toggle vehicle availability." 
                      : "Choose your vehicle and book your rental dates with instant approval tracking."}
                  </p>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setCarToEdit(null);
                      setIsAddEditCarModalOpen(true);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Car</span>
                  </button>
                )}
              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Brand:
                  </span>
                  <button
                    type="button"
                    onClick={() => setCarBrandFilter('All')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      carBrandFilter === 'All'
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Brands ({cars.length})
                  </button>
                  {fleetBrands.map(brand => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setCarBrandFilter(brand)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        carBrandFilter.toLowerCase() === brand.toLowerCase()
                          ? 'bg-slate-950 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-bold text-slate-500">
                  Showing {filteredCars.length} of {cars.length} cars
                </div>
              </div>

              {/* Cars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredCars.map(car => {
                  const dailyRate = car.daily_rate || (car.price ? Math.round(car.price / 160) : 1500);
                  const isAvail = car.availability === 'Available' || !car.availability;

                  return (
                    <div
                      key={car.id}
                      className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        
                        {/* Car Image with Badge */}
                        <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 p-2 flex items-center justify-center border border-slate-100">
                          <img
                            src={car.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80'}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                          />
                          <div className="absolute top-3 left-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs ${
                              isAvail 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-slate-800 text-slate-200'
                            }`}>
                              {car.availability || 'Available'}
                            </span>
                          </div>
                        </div>

                        {/* Specs & Titles */}
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">
                            {car.brand}
                          </span>
                          <h3 className="text-base font-black text-slate-950 font-display truncate">
                            {car.model}
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Power</span>
                            <span className="font-bold text-slate-900">{car.horsepower || 700} HP</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Transmission</span>
                            <span className="font-bold text-slate-900 truncate block">{car.transmission?.split(' ')?.[0] || 'Dual-Clutch'}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex items-baseline justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase block">Daily Rental</span>
                            <span className="text-lg font-black text-slate-950 font-display">{formatPrice(dailyRate)}</span>
                            <span className="text-[10px] text-slate-500"> / day</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">Year {car.year}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 mt-3 border-t border-slate-100">
                        {isAdmin ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCarToEdit(car);
                                setIsAddEditCarModalOpen(true);
                              }}
                              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${car.brand} ${car.model} from fleet?`)) {
                                  deleteCar(car.id);
                                }
                              }}
                              className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-all cursor-pointer"
                              title="Delete Car"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCarForRentalBooking(car)}
                            disabled={!isAvail}
                            className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isAvail
                                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 active:scale-95'
                                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{isAvail ? 'Book Now' : 'Currently Reserved'}</span>
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 3: ADMIN BOOKING REQUESTS TAB */}
          {/* ================================================================= */}
          {isAdmin && activeTab === 'booking-requests' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                    Pending Booking Requests ({pendingBookingRequests.length})
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review and authorize incoming car rental requests before confirming vehicle release.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                {pendingBookingRequests.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-xs space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-80" />
                    <h4 className="text-base font-bold text-slate-900 font-display">No Pending Booking Requests</h4>
                    <p className="text-slate-400 max-w-sm mx-auto">
                      All rental bookings have been reviewed and decided. New incoming requests will appear here immediately.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View (md and above) */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full min-w-[960px] text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                            <th className="py-3.5 px-4 whitespace-nowrap">Booking ID</th>
                            <th className="py-3.5 px-4 whitespace-nowrap">Customer Details</th>
                            <th className="py-3.5 px-4 whitespace-nowrap">Vehicle</th>
                            <th className="py-3.5 px-4 whitespace-nowrap">Schedule</th>
                            <th className="py-3.5 px-4 whitespace-nowrap">Pickup Location</th>
                            <th className="py-3.5 px-4 whitespace-nowrap">Created Date</th>
                            <th className="py-3.5 px-4 text-right whitespace-nowrap">Decisions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {pendingBookingRequests.map(booking => (
                            <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                                  {booking.booking_code || booking.id}
                                </span>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <p className="font-bold text-slate-900">{booking.user_name || 'Guest VIP'}</p>
                                <p className="text-[11px] text-slate-500">{booking.user_email || '—'}</p>
                                <p className="text-[10px] text-slate-400">{booking.phone || '—'}</p>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={booking.car_image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=200&q=80'}
                                    alt={booking.car_model}
                                    className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs"
                                  />
                                  <div>
                                    <span className="font-black text-amber-600 block">{booking.car_brand}</span>
                                    <span className="font-bold text-slate-900">{booking.car_model}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80 w-fit">
                                  <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span>{formatBookingDate(booking.pickup_date)}</span>
                                  <span className="text-slate-400 font-bold">→</span>
                                  <span>{formatBookingDate(booking.return_date)}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                                <div className="flex items-center gap-1.5" title={booking.pickup_location}>
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="max-w-[200px] truncate">{booking.pickup_location || 'Dealership Showroom Sanctuary'}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-[11px] font-medium">
                                {formatBookingDate(booking.created_at)}
                              </td>
                              <td className="py-4 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedBookingForDetails(booking)}
                                    className="py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Details</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => approveRentalBooking(booking.id)}
                                    className="py-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer whitespace-nowrap"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedBookingForReject(booking)}
                                    className="py-1.5 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer whitespace-nowrap"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View (below md) */}
                    <div className="block md:hidden p-3 sm:p-4 space-y-3">
                      {pendingBookingRequests.map(booking => (
                        <div key={booking.id} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3 shadow-2xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                              {booking.booking_code || booking.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                              Pending
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-black uppercase text-amber-600 block">{booking.car_brand}</span>
                            <h4 className="text-sm font-bold text-slate-950">{booking.car_model}</h4>
                            <div className="text-xs text-slate-600 mt-2 space-y-1 bg-white p-2.5 rounded-xl border border-amber-100">
                              <p><strong className="text-slate-800">Client:</strong> {booking.user_name} ({booking.user_email})</p>
                              <p><strong className="text-slate-800">Phone:</strong> {booking.phone}</p>
                              <p><strong className="text-slate-800">Schedule:</strong> {formatBookingDate(booking.pickup_date)} → {formatBookingDate(booking.return_date)}</p>
                              <p><strong className="text-slate-800">Pickup:</strong> {booking.pickup_location}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForDetails(booking)}
                              className="py-2 px-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs text-center cursor-pointer inline-flex items-center justify-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => approveRentalBooking(booking.id)}
                              className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase text-center cursor-pointer shadow-xs"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForReject(booking)}
                              className="py-2 px-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase text-center cursor-pointer shadow-xs"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 4: ALL BOOKINGS (Admin) / MY BOOKINGS (User) */}
          {/* ================================================================= */}
          {(activeTab === 'all-bookings' || activeTab === 'my-bookings') && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                    {isAdmin ? "All Dealership Bookings" : "My Rental Bookings"}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isAdmin 
                      ? "Search, inspect, and filter historical and active car rental records." 
                      : "Monitor your rental status, view certified dossiers, and track approvals."}
                  </p>
                </div>

                {!isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('cars')}
                    className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book Another Vehicle</span>
                  </button>
                )}
              </div>

              {/* Status Filters & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {['All', 'Pending', 'Approved', 'Completed', 'Rejected', 'Cancelled'].map(status => {
                    const count = status === 'All' 
                      ? (isAdmin ? bookings.length : myBookings.length)
                      : (isAdmin ? bookings : myBookings).filter(b => b.status?.toLowerCase() === status.toLowerCase()).length;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setBookingStatusFilter(status)}
                        className={`py-1.5 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          bookingStatusFilter.toLowerCase() === status.toLowerCase()
                            ? 'bg-slate-950 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{status}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                          bookingStatusFilter.toLowerCase() === status.toLowerCase()
                            ? 'bg-slate-800 text-amber-400'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-bold text-slate-500">
                  Showing {filteredBookings.length} bookings
                </div>
              </div>

              {/* Bookings Table / Mobile Cards */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-xs space-y-2">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="text-base font-bold text-slate-800 font-display">No bookings found</h4>
                    <p className="text-slate-400 max-w-sm mx-auto">
                      No bookings matching your active filters. Try selecting another status filter or reset search.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View (md and above) */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full min-w-[960px] text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                            <th className="py-3.5 px-4 whitespace-nowrap">Booking ID</th>
                            <th className="py-3.5 px-4 whitespace-nowrap">Vehicle</th>
                            {isAdmin && <th className="py-3.5 px-4 whitespace-nowrap">Customer</th>}
                            <th className="py-3.5 px-4 whitespace-nowrap">Schedule</th>
                            <th className="py-3.5 px-4 whitespace-nowrap">Pickup Location</th>
                            <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                            <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredBookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                                  {booking.booking_code || booking.id}
                                </span>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={booking.car_image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=200&q=80'}
                                    alt={booking.car_model}
                                    className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs"
                                  />
                                  <div>
                                    <span className="font-black text-amber-600 block">{booking.car_brand}</span>
                                    <span className="font-bold text-slate-900">{booking.car_model}</span>
                                  </div>
                                </div>
                              </td>
                              {isAdmin && (
                                <td className="py-4 px-4 whitespace-nowrap">
                                  <p className="font-bold text-slate-900">{booking.user_name || 'Guest VIP'}</p>
                                  <p className="text-[11px] text-slate-400">{booking.user_email || '—'}</p>
                                </td>
                              )}
                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80 w-fit">
                                  <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span>{formatBookingDate(booking.pickup_date)}</span>
                                  <span className="text-slate-400 font-bold">→</span>
                                  <span>{formatBookingDate(booking.return_date)}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                                <div className="flex items-center gap-1.5" title={booking.pickup_location}>
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="max-w-[200px] truncate">{booking.pickup_location || 'Beverly Hills Showroom Sanctuary'}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                {renderStatusBadge(booking.status)}
                              </td>
                              <td className="py-4 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedBookingForDetails(booking)}
                                    className="py-2 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-2xs cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 hover:scale-102"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                                    <span>View Details</span>
                                  </button>
                                  {isAdmin && booking.status === 'Approved' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (window.confirm(`Mark rental for ${booking.car_brand} ${booking.car_model} as Completed and return vehicle to Available fleet?`)) {
                                          completeRentalBooking(booking.id);
                                        }
                                      }}
                                      className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap hover:scale-102"
                                      title="Complete rental and return vehicle to available fleet"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Complete Rental</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View (below md) */}
                    <div className="block md:hidden divide-y divide-slate-100 p-2 sm:p-4 space-y-3">
                      {filteredBookings.map(booking => (
                        <div key={booking.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3 shadow-2xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                              {booking.booking_code || booking.id}
                            </span>
                            {renderStatusBadge(booking.status)}
                          </div>

                          <div className="flex items-center gap-3">
                            <img
                              src={booking.car_image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=200&q=80'}
                              alt={booking.car_model}
                              className="w-16 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-black uppercase text-amber-600 block truncate">{booking.car_brand}</span>
                              <h4 className="text-sm font-bold text-slate-950 truncate">{booking.car_model}</h4>
                              {isAdmin && (
                                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                  Client: <strong className="text-slate-700">{booking.user_name}</strong>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-100">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase block">Schedule</span>
                              <span className="font-semibold text-slate-800">{formatBookingDate(booking.pickup_date)} → {formatBookingDate(booking.return_date)}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase block">Location</span>
                              <span className="font-semibold text-slate-800 truncate block">{booking.pickup_location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForDetails(booking)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider text-center cursor-pointer inline-flex items-center justify-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-400" />
                              <span>View Details</span>
                            </button>
                            {isAdmin && booking.status === 'Approved' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Mark rental for ${booking.car_brand} ${booking.car_model} as Completed and return vehicle to Available fleet?`)) {
                                    completeRentalBooking(booking.id);
                                  }
                                }}
                                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase text-center cursor-pointer"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 5: USERS DIRECTORY TAB (Admin Only) */}
          {/* ================================================================= */}
          {isAdmin && activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                    Registered Users Directory ({registeredUsers.length})
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage client profiles, view booking counts, and verify accounts.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Account Role</th>
                        <th className="py-3 px-4">Membership Level</th>
                        <th className="py-3 px-4">Total Bookings</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {registeredUsers.map(u => {
                        const userBookingsCount = bookings.filter(b => 
                          b.user_email?.toLowerCase() === u.email?.toLowerCase() || b.user_id === u.id
                        ).length;

                        return (
                          <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-950 text-amber-400 font-bold text-[10px] flex items-center justify-center">
                                {u.name ? u.name.slice(0, 2).toUpperCase() : 'US'}
                              </div>
                              <span>{u.name}</span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                            <td className="py-3.5 px-4 text-slate-600">{u.phone || '+1 (555) 000-0000'}</td>
                            <td className="py-3.5 px-4 font-black uppercase text-[10px] text-amber-700">
                              {u.role === 'admin' ? 'Administrator' : 'Customer'}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 font-medium">
                              {u.membershipTier || 'Platinum VIP Member'}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {userBookingsCount} Bookings
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Active
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="block md:hidden p-3 sm:p-4 space-y-3">
                  {registeredUsers.map(u => {
                    const userBookingsCount = bookings.filter(b => 
                      b.user_email?.toLowerCase() === u.email?.toLowerCase() || b.user_id === u.id
                    ).length;

                    return (
                      <div key={u.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-950 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                              {u.name ? u.name.slice(0, 2).toUpperCase() : 'US'}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                              <span className="text-[10px] font-black uppercase text-amber-700">
                                {u.role === 'admin' ? 'Administrator' : 'Customer'}
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Active
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 space-y-1 bg-white p-2.5 rounded-xl border border-slate-100">
                          <p><strong className="text-slate-800">Email:</strong> {u.email}</p>
                          <p><strong className="text-slate-800">Phone:</strong> {u.phone || '+1 (555) 000-0000'}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
                            <span>Tier: <strong className="text-amber-700">{u.membershipTier || 'VIP Member'}</strong></span>
                            <span><strong className="text-slate-900">{userBookingsCount}</strong> Bookings</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 6: NOTIFICATIONS TAB (Role-Based) */}
          {/* ================================================================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                    Notification Center
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time updates regarding booking requests, approvals, and allocation dossiers.
                  </p>
                </div>

                {unreadNotifsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllNotificationsAsRead()}
                    className="py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer self-start sm:self-auto"
                  >
                    Mark All as Read ({unreadNotifsCount})
                  </button>
                )}
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                {relevantNotifications.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-xs space-y-2">
                    <Bell className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="text-base font-bold text-slate-800 font-display">Inbox is clean</h4>
                    <p className="text-slate-400">You have no notifications in your history.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {relevantNotifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          notif.is_read
                            ? 'bg-slate-50/70 border-slate-200/80 text-slate-600'
                            : 'bg-amber-50/80 border-amber-300 text-slate-900 shadow-2xs'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {!notif.is_read && (
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                            )}
                            <h4 className="font-bold text-slate-950 text-sm">{notif.title}</h4>
                            <span className="text-[10px] text-slate-400">
                              {notif.created_at ? new Date(notif.created_at).toLocaleString() : 'Just now'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed pl-4 sm:pl-4">
                            {notif.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {notif.booking_id && (
                            <button
                              type="button"
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                handleTabChange(isAdmin ? 'all-bookings' : 'my-bookings');
                                const targetB = bookings.find(b => b.id === notif.booking_id || b.booking_code === notif.booking_id);
                                if (targetB) setSelectedBookingForDetails(targetB);
                              }}
                              className="py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all"
                            >
                              Open Booking
                            </button>
                          )}
                          {!notif.is_read && (
                            <button
                              type="button"
                              onClick={() => markNotificationAsRead(notif.id)}
                              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-200 text-slate-600"
                              title="Mark read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteNotification(notif.id)}
                            className="p-1.5 rounded-xl border border-rose-200 hover:bg-rose-100 text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 7: PROFILE TAB (Both Roles) */}
          {/* ================================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <button
                    type="button"
                    onClick={() => handleTabChange('overview')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors mb-2 cursor-pointer group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-amber-500" />
                    <span>Return to Overview</span>
                  </button>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                    Profile Specifications
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your contact details, membership tier, and communication preferences.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTabChange('overview')}
                  className="hidden sm:inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                  <span>Return</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-luxury space-y-6">
                
                {/* Profile Header Avatar & Verified Role */}
                {(() => {
                  const isUserAdminRole = isAdmin || customerProfile?.role === 'admin' || profileFormData.email?.toLowerCase().includes('admin');
                  const initials = profileFormData.name 
                    ? profileFormData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
                    : (isUserAdminRole ? 'AD' : 'JS');
                  const roleBadge = isUserAdminRole ? 'Dealership Administrator' : (profileFormData.membershipTier || 'Platinum VIP Member');

                  return (
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                      <div className="w-16 h-16 rounded-2xl bg-slate-950 text-amber-400 font-black text-xl flex items-center justify-center shadow-md">
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-950 font-display">{profileFormData.name}</h3>
                        <p className="text-xs text-slate-500">{profileFormData.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          {roleBadge}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={profileFormData.name}
                      onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={profileFormData.email}
                        onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number (10 digits)</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        pattern="[0-9]{10}"
                        required
                        value={profileFormData.phone}
                        onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        placeholder="10-digit number (e.g. 9876543210)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Membership Tier</label>
                    <select
                      value={profileFormData.membershipTier}
                      onChange={(e) => setProfileFormData({ ...profileFormData, membershipTier: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
                    >
                      <option value="Platinum VIP Member">Platinum VIP Member</option>
                      <option value="Diamond Collector Club">Diamond Collector Club</option>
                      <option value="Private Garage Tier">Private Garage Tier</option>
                      <option value="Dealership Principal">Dealership Principal</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleTabChange('overview')}
                      className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                      <span>Return</span>
                    </button>
                    <button
                      type="submit"
                      className="py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 transition-all cursor-pointer"
                    >
                      Save Profile Updates
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* ===================================================================== */}
      {/* GLOBAL MODALS */}
      {/* ===================================================================== */}

      {/* 1. View Booking Details Modal */}
      <BookingDetailsModal
        isOpen={!!selectedBookingForDetails}
        onClose={() => setSelectedBookingForDetails(null)}
        booking={selectedBookingForDetails}
        onCancelBooking={cancelRentalBooking}
        onCompleteBooking={completeRentalBooking}
        isAdmin={isAdmin}
      />

      {/* 2. Admin Reject Booking Modal */}
      <RejectBookingDialog
        isOpen={!!selectedBookingForReject}
        onClose={() => setSelectedBookingForReject(null)}
        booking={selectedBookingForReject}
        onConfirmReject={rejectRentalBooking}
      />

      {/* 3. User Rental Booking Modal */}
      <RentalBookingModal
        isOpen={!!carForRentalBooking}
        onClose={() => setCarForRentalBooking(null)}
        selectedCar={carForRentalBooking}
        onBookingSuccess={() => {
          handleTabChange('my-bookings');
        }}
      />

      {/* 4. Admin Add / Edit Car Modal */}
      <AddEditCarModal
        isOpen={isAddEditCarModalOpen}
        onClose={() => {
          setIsAddEditCarModalOpen(false);
          setCarToEdit(null);
        }}
        carToEdit={carToEdit}
        onSaveCar={(carData) => {
          if (carToEdit) {
            updateCar(carToEdit.id, carData);
          } else {
            addCar(carData);
          }
        }}
      />

    </div>
  );
}

export default UnifiedDashboard;
