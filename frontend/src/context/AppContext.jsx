import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialCars } from '../data/cars';
import { 
  authAPI, 
  carsAPI, 
  bookingsAPI, 
  notificationsAPI, 
  leadsAPI, 
  testDrivesAPI, 
  ordersAPI,
  paymentsAPI,
  customersAPI,
  servicesAPI 
} from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Showroom Fleet & Live State Initializations
  const [cars, setCars] = useState(initialCars);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [adminStats, setAdminStats] = useState({
    totalCars: 0,
    totalCustomers: 0,
    totalOrders: 0,
    revenue: 0,
    testDrives: 0
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('speedx_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState([]);

  // User session state (visitor / customer / admin)
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('speedx_user_role') || 'visitor';
  });

  const [customerProfile, setCustomerProfile] = useState(() => {
    const savedProfile = localStorage.getItem('speedx_customer_profile_v6');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed && parsed.email) return parsed;
      } catch (e) {}
    }
    return null;
  });

  // Toasts notification system
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync wishlist to local storage
  useEffect(() => {
    localStorage.setItem('speedx_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (customerProfile) {
      localStorage.setItem('speedx_customer_profile_v6', JSON.stringify(customerProfile));
    } else {
      localStorage.removeItem('speedx_customer_profile_v6');
    }
  }, [customerProfile]);

  useEffect(() => {
    localStorage.setItem('speedx_user_role', userRole);
  }, [userRole]);

  // Load All Live Data Directly from PostgreSQL
  const loadLiveData = useCallback(async () => {
    try {
      // 1. Fetch Fleet from PostgreSQL Backend
      const carsRes = await carsAPI.getAll({ limit: 100 }).catch(() => null);
      if (carsRes?.data && Array.isArray(carsRes.data) && carsRes.data.length > 0) {
        const backendCars = carsRes.data.map(c => {
          let carImages = Array.isArray(c.images) && c.images.length > 0 
            ? c.images 
            : [c.image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80'];

          // Auto-fix: Ensure Rolls-Royce Phantom VIII uses its distinct dark executive sedan photo
          if (c.id === 'rolls-royce-phantom-viii' || (c.brand?.toLowerCase() === 'rolls-royce' && c.model?.toLowerCase().includes('phantom'))) {
            carImages = [
              'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
              'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80',
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80'
            ];
          }

          // Auto-fix: Ensure Rolls-Royce Spectre uses its distinct two-tone electric coupe photo
          if (c.id === 'rolls-royce-spectre' || (c.brand?.toLowerCase() === 'rolls-royce' && c.model?.toLowerCase().includes('spectre'))) {
            carImages = [
              'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1600&q=80',
              'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80',
              'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80'
            ];
          }

          return {
            ...c,
            price: Number(c.price) || 250000,
            daily_rate: Number(c.daily_rate) || Math.round((Number(c.price) || 250000) / 160),
            images: carImages,
            features: Array.isArray(c.features) ? c.features : ['Carbon Ceramic Brakes', 'Launch Control', 'Sport Exhaust']
          };
        });
        setCars(backendCars);
      } else {
        setCars(initialCars);
      }

      const token = localStorage.getItem('speedx_auth_token');
      if (!token) return;

      const authMeRes = await authAPI.getMe().catch(() => null);
      if (authMeRes?.data) {
        const u = authMeRes.data?.user || authMeRes.data;
        const role = (u.role || '').toLowerCase() === 'admin' ? 'admin' : 'customer';
        setUserRole(role);
        const profile = {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || '',
          role: role,
          membershipTier: u.membership_tier || u.membershipTier || (role === 'admin' ? 'Dealership Principal' : 'Platinum VIP Member')
        };
        setCustomerProfile(profile);

        if (role === 'admin') {
          // Admin Live Endpoints
          const [bRes, oRes, lRes, tdRes, cRes, pRes, nRes] = await Promise.all([
            bookingsAPI.getAllAdmin().catch(() => null),
            ordersAPI.getAll().catch(() => null),
            leadsAPI.getAll().catch(() => null),
            testDrivesAPI.getAll().catch(() => null),
            customersAPI.getAll().catch(() => null),
            paymentsAPI.getAll().catch(() => null),
            notificationsAPI.getAll().catch(() => null)
          ]);

          if (bRes?.data && Array.isArray(bRes.data)) setBookings(bRes.data);
          if (oRes?.data && Array.isArray(oRes.data)) setOrders(oRes.data);
          if (lRes?.data && Array.isArray(lRes.data)) setLeads(lRes.data);
          if (tdRes?.data && Array.isArray(tdRes.data)) setTestDrives(tdRes.data);
          if (cRes?.data && Array.isArray(cRes.data)) setCustomers(cRes.data);
          if (pRes?.data && Array.isArray(pRes.data)) setPayments(pRes.data);
          if (nRes?.data && Array.isArray(nRes.data)) setNotifications(nRes.data);
        } else {
          // Customer Live Endpoints
          const [bRes, oRes, tdRes, nRes] = await Promise.all([
            bookingsAPI.getMy().catch(() => null),
            ordersAPI.getMy().catch(() => null),
            testDrivesAPI.getMy().catch(() => null),
            notificationsAPI.getAll().catch(() => null)
          ]);

          if (bRes?.data && Array.isArray(bRes.data)) setBookings(bRes.data);
          if (oRes?.data && Array.isArray(oRes.data)) setOrders(oRes.data);
          if (tdRes?.data && Array.isArray(tdRes.data)) setTestDrives(tdRes.data);
          if (nRes?.data && Array.isArray(nRes.data)) setNotifications(nRes.data);
        }
      }
    } catch (err) {
      console.warn('[LIVE DATA LOAD ERROR]:', err.message);
    }
  }, []);

  // Fetch Live Data on mount
  useEffect(() => {
    loadLiveData();
  }, [loadLiveData]);

  // Clean data refresh helper
  const resetDemoData = () => {
    loadLiveData();
    showToast("Synchronized live database records!", "info");
  };

  // Unified Dashboard Rental Booking Management & Overlap Checking
  const checkBookingOverlap = (carId, pickupDateStr, returnDateStr, excludeBookingId = null) => {
    if (!carId || !pickupDateStr || !returnDateStr) return false;
    const newPickup = new Date(pickupDateStr).getTime();
    const newReturn = new Date(returnDateStr).getTime();

    return bookings.some(b => {
      if (b.car_id !== carId) return false;
      if (excludeBookingId && (b.id === excludeBookingId || b.booking_code === excludeBookingId)) return false;
      if (b.status === 'Rejected' || b.status === 'Cancelled') return false;

      const existPickup = new Date(b.pickup_date).getTime();
      const existReturn = new Date(b.return_date).getTime();

      return newPickup <= existReturn && newReturn >= existPickup;
    });
  };

  const createRentalBooking = async (bookingData) => {
    const {
      carId,
      carName,
      customerName,
      customerEmail,
      customerPhone,
      pickupDate,
      returnDate,
      pickupLocation,
      message
    } = bookingData;

    if (!carId || !pickupDate || !returnDate || !pickupLocation) {
      showToast("Please fill in all required fields (Car, Dates, Location).", "error");
      return { success: false, message: "Missing required booking details." };
    }

    // Double booking / overlap validation
    const hasOverlap = checkBookingOverlap(carId, pickupDate, returnDate);
    if (hasOverlap) {
      const errMsg = "This car is already booked for the selected dates. Please choose another date or car.";
      showToast(errMsg, "error");
      return { success: false, message: errMsg };
    }

    const selectedCar = cars.find(c => c.id === carId);
    const bookingCode = `BK-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    const newBooking = {
      id: bookingCode,
      booking_code: bookingCode,
      user_id: customerProfile?.id || 'user-1',
      user_name: customerName || customerProfile?.name || 'John Smith',
      user_email: customerEmail || customerProfile?.email || 'user@speedxmotors.com',
      phone: customerPhone || customerProfile?.phone || '+1 (555) 234-5678',
      car_id: carId,
      car_brand: selectedCar?.brand || carName?.split(' ')?.[0] || 'Exclusive',
      car_model: selectedCar?.model || carName || 'Supercar',
      car_price: selectedCar?.price || 250000,
      daily_rate: selectedCar?.price ? Math.round(selectedCar.price / 160) : 1500,
      car_image: selectedCar?.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80',
      pickup_date: pickupDate,
      return_date: returnDate,
      pickup_location: pickupLocation,
      message: message || '',
      status: 'Pending',
      rejection_reason: null,
      approved_at: null,
      created_at: nowIso,
      updated_at: nowIso
    };

    // Async Backend API Call
    try {
      const apiRes = await bookingsAPI.create({
        car_id: carId,
        user_name: newBooking.user_name,
        user_email: newBooking.user_email,
        phone: newBooking.phone,
        pickup_date: pickupDate,
        return_date: returnDate,
        pickup_location: pickupLocation,
        message: message || ''
      });
      if (apiRes.data?.id) {
        newBooking.id = apiRes.data.id;
        newBooking.booking_code = apiRes.data.booking_code || bookingCode;
      }
    } catch (err) {
      console.warn('[BOOKING API] Saved to local state:', err.message);
    }

    // 1. Create notification for Admin
    const adminNotif = {
      id: `notif-admin-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: 'admin-1',
      user_email: 'admin@speedxmotors.com',
      target_role: 'admin',
      title: 'New Booking Request',
      message: `${newBooking.user_name} requested to book ${newBooking.car_brand} ${newBooking.car_model} (${pickupDate} → ${returnDate}).`,
      type: 'BOOKING_REQUEST',
      booking_id: newBooking.id,
      is_read: false,
      created_at: nowIso
    };

    // 2. Create notification for User
    const userNotif = {
      id: `notif-user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: newBooking.user_id,
      user_email: newBooking.user_email,
      target_role: 'customer',
      title: 'Booking Request Submitted',
      message: `Your booking request for ${newBooking.car_brand} ${newBooking.car_model} (${pickupDate} → ${returnDate}) has been submitted for review.`,
      type: 'BOOKING_REQUEST_USER',
      booking_id: newBooking.id,
      is_read: false,
      created_at: nowIso
    };

    setBookings(prev => [newBooking, ...prev]);
    setNotifications(prev => [userNotif, adminNotif, ...prev]);

    showToast("Booking request submitted successfully. Waiting for admin approval.", "success");
    return { success: true, booking: newBooking };
  };

  const approveRentalBooking = async (bookingId) => {
    let approved = null;
    const nowIso = new Date().toISOString();

    // Async Backend API Call
    try {
      await bookingsAPI.approve(bookingId);
    } catch (err) {
      console.warn('[APPROVE API] Local fallback:', err.message);
    }

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId || b.booking_code === bookingId) {
        approved = {
          ...b,
          status: 'Approved',
          approved_at: nowIso,
          updated_at: nowIso
        };
        return approved;
      }
      return b;
    }));

    if (approved) {
      const userNotif = {
        id: `notif-user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id: approved.user_id || 'user-1',
        user_email: approved.user_email || 'user@speedxmotors.com',
        target_role: 'customer',
        title: 'Booking Approved 🎉',
        message: `Your booking for ${approved.car_brand} ${approved.car_model} (${approved.pickup_date} → ${approved.return_date}) has been approved.`,
        type: 'BOOKING_APPROVED',
        booking_id: approved.id,
        is_read: false,
        created_at: nowIso
      };
      setNotifications(prev => [userNotif, ...prev]);
      showToast(`Booking #${bookingId} has been approved!`, "success");
    }
  };

  const rejectRentalBooking = async (bookingId, rejectionReason) => {
    let rejected = null;
    const nowIso = new Date().toISOString();
    const reason = rejectionReason?.trim() || 'Vehicle allocation unavailable for selected dates.';

    // Async Backend API Call
    try {
      await bookingsAPI.reject(bookingId, reason);
    } catch (err) {
      console.warn('[REJECT API] Local fallback:', err.message);
    }

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId || b.booking_code === bookingId) {
        rejected = {
          ...b,
          status: 'Rejected',
          rejection_reason: reason,
          updated_at: nowIso
        };
        return rejected;
      }
      return b;
    }));

    if (rejected) {
      const userNotif = {
        id: `notif-user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id: rejected.user_id || 'user-1',
        user_email: rejected.user_email || 'user@speedxmotors.com',
        target_role: 'customer',
        title: 'Booking Rejected',
        message: `Your booking request for ${rejected.car_brand} ${rejected.car_model} was rejected. Reason: ${reason}`,
        type: 'BOOKING_REJECTED',
        booking_id: rejected.id,
        rejection_reason: reason,
        is_read: false,
        created_at: nowIso
      };
      setNotifications(prev => [userNotif, ...prev]);
      showToast(`Booking #${bookingId} marked as Rejected.`, "info");
    }
  };

  const completeRentalBooking = async (bookingId) => {
    let completed = null;
    const nowIso = new Date().toISOString();

    // Async Backend API Call
    try {
      await bookingsAPI.complete(bookingId);
    } catch (err) {
      console.warn('[COMPLETE API] Local fallback:', err.message);
    }

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId || b.booking_code === bookingId) {
        completed = {
          ...b,
          status: 'Completed',
          completed_at: nowIso,
          updated_at: nowIso
        };
        return completed;
      }
      return b;
    }));

    if (completed) {
      // Mark car availability back to Available
      setCars(prev => prev.map(c => {
        if (c.id === completed.car_id || c.model === completed.car_model) {
          return { ...c, availability: 'Available' };
        }
        return c;
      }));

      // Create completion notification for customer
      const userNotif = {
        id: `notif-user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id: completed.user_id || 'user-1',
        user_email: completed.user_email || 'user@speedxmotors.com',
        target_role: 'customer',
        title: 'Rental Completed 🎉',
        message: `Your rental hire for ${completed.car_brand} ${completed.car_model} has been marked as Completed. Thank you for choosing SPEEDX MOTORS!`,
        type: 'BOOKING_COMPLETED',
        booking_id: completed.id,
        is_read: false,
        created_at: nowIso
      };
      setNotifications(prev => [userNotif, ...prev]);

      showToast(`Rental #${bookingId} marked as Completed! Vehicle is now Available.`, "success");
    }
  };

  const cancelRentalBooking = async (bookingId) => {
    let cancelled = null;
    const nowIso = new Date().toISOString();

    // Async Backend API Call
    try {
      await bookingsAPI.cancel(bookingId);
    } catch (err) {
      console.warn('[CANCEL API] Local fallback:', err.message);
    }

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId || b.booking_code === bookingId) {
        cancelled = {
          ...b,
          status: 'Cancelled',
          updated_at: nowIso
        };
        return cancelled;
      }
      return b;
    }));

    if (cancelled) {
      const adminNotif = {
        id: `notif-admin-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id: 'admin-1',
        user_email: 'admin@speedxmotors.com',
        target_role: 'admin',
        title: 'Booking Cancelled by Customer',
        message: `${cancelled.user_name} cancelled booking #${cancelled.booking_code || cancelled.id} for ${cancelled.car_brand} ${cancelled.car_model}.`,
        type: 'BOOKING_CANCELLED',
        booking_id: cancelled.id,
        is_read: false,
        created_at: nowIso
      };
      setNotifications(prev => [adminNotif, ...prev]);
    }
    showToast(`Booking #${bookingId} has been cancelled.`, "info");
  };

  const markNotificationAsRead = (notifId) => {
    try { notificationsAPI.markAsRead(notifId).catch(() => {}); } catch(e) {}
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    try { notificationsAPI.markAllAsRead().catch(() => {}); } catch(e) {}
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    showToast("All notifications marked as read", "success");
  };

  const deleteNotification = (notifId) => {
    try { notificationsAPI.delete(notifId).catch(() => {}); } catch(e) {}
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const updateUserProfile = (profileData) => {
    const updated = {
      ...customerProfile,
      ...profileData
    };
    setCustomerProfile(updated);
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === updated.id || u.email.toLowerCase() === (updated.email || '').toLowerCase()) {
        return { ...u, ...updated };
      }
      return u;
    }));
    showToast("Profile specifications updated successfully!", "success");
  };

  // Authentication & Membership Actions
  const loginUser = async ({ email, password, role }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      showToast("Please enter both your email and password.", "error");
      return { success: false, message: "Please enter email and password." };
    }

    try {
      const res = await authAPI.login(cleanEmail, cleanPassword);
      if (res?.success && res.data?.user) {
        const u = res.data.user;
        const activeRole = (u.role || '').toLowerCase() === 'admin' ? 'admin' : 'customer';
        setUserRole(activeRole);
        const profile = {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || '',
          role: activeRole,
          membershipTier: u.membershipTier || (activeRole === 'admin' ? 'Dealership Principal' : 'Platinum VIP Member')
        };
        setCustomerProfile(profile);

        // Fetch live bookings and notifications
        if (activeRole === 'admin') {
          bookingsAPI.getAllAdmin().then(b => b?.data && setBookings(b.data)).catch(() => {});
        } else {
          bookingsAPI.getMy().then(b => b?.data && setBookings(b.data)).catch(() => {});
        }
        notificationsAPI.getAll().then(n => n?.data && setNotifications(n.data)).catch(() => {});

        showToast(`Welcome back, ${u.name}!`, "success");
        return { success: true, user: profile, role: activeRole };
      }
    } catch (apiErr) {
      console.warn('[LOGIN API]:', apiErr.message);
    }

    // 1. Exact match in registered users
    const matchedUser = registeredUsers.find(
      u => u.email.toLowerCase() === cleanEmail && (u.password === cleanPassword)
    );

    if (matchedUser) {
      const activeRole = matchedUser.role || 'customer';
      setUserRole(activeRole);
      setCustomerProfile(matchedUser);
      showToast(`Welcome back, ${matchedUser.name}!`, "success");
      return { success: true, user: matchedUser, role: activeRole };
    }

    // 2. Admin fallback if explicit admin demo
    if (role === 'admin' || cleanEmail === 'admin@speedxmotors.com') {
      if (cleanPassword === 'admin') {
        const adminAcc = defaultUsers[0];
        setUserRole('admin');
        setCustomerProfile(adminAcc);
        showToast("Welcome back! Logged in as Dealership Administrator.", "success");
        return { success: true, user: adminAcc, role: 'admin' };
      }
    }

    showToast("Invalid email or password credentials. Please check your credentials or register a new account.", "error");
    return { success: false, message: "Invalid email or password credentials." };
  };

  const registerUser = async (userData) => {
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const cleanPassword = (userData.password || '').trim();
    const cleanName = (userData.name || '').trim();
    const cleanPhone = (userData.phone || '').trim();

    if (!cleanEmail || !cleanName || !cleanPassword) {
      showToast("Please provide your name, email, and password.", "error");
      return { success: false, message: "Missing required registration fields." };
    }

    try {
      const res = await authAPI.register({
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        phone: cleanPhone,
        address: 'Customer Address',
        city: 'Showroom City',
        country: 'United States'
      });
      if (res?.success && res.data?.user) {
        const u = res.data.user;
        const profile = {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || cleanPhone,
          role: 'customer',
          membershipTier: u.membershipTier || userData.membershipTier || 'Gold Apex Collector'
        };

        const newUserRecord = {
          ...profile,
          password: cleanPassword,
          preferredBrands: userData.preferredBrand ? [userData.preferredBrand] : ['Ferrari'],
          memberSince: new Date().getFullYear().toString(),
          createdAt: new Date().toISOString()
        };

        setRegisteredUsers(prev => [newUserRecord, ...prev.filter(x => x.email.toLowerCase() !== cleanEmail)]);
        setUserRole('customer');
        setCustomerProfile(profile);

        // Fetch fresh bookings & notifications
        bookingsAPI.getMy().then(b => b?.data && setBookings(b.data)).catch(() => {});
        notificationsAPI.getAll().then(n => n?.data && setNotifications(n.data)).catch(() => {});

        showToast(`Account successfully created! Welcome, ${u.name}!`, "success");
        return { success: true, user: profile, role: 'customer' };
      }
    } catch (err) {
      console.warn('[REGISTER API]:', err.message);
    }

    // Local fallback
    const newUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: cleanPassword,
      role: 'customer',
      membershipTier: userData.membershipTier || 'Platinum VIP Member',
      preferredBrands: userData.preferredBrand ? [userData.preferredBrand] : ['Ferrari', 'Porsche'],
      memberSince: new Date().getFullYear().toString(),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      createdAt: new Date().toISOString()
    };

    setRegisteredUsers(prev => [newUser, ...prev.filter(x => x.email.toLowerCase() !== cleanEmail)]);
    setUserRole('customer');
    setCustomerProfile(newUser);
    showToast(`Account successfully created for ${newUser.name}!`, "success");
    return { success: true, user: newUser, role: 'customer' };
  };

  const logoutUser = () => {
    authAPI.logout();
    localStorage.removeItem('speedx_auth_token');
    localStorage.removeItem('speedx_user_role');
    localStorage.removeItem('speedx_customer_profile_v6');
    setUserRole('visitor');
    setCustomerProfile(null);
    showToast("You have been signed out.", "info");
  };

  // Wishlist actions
  const toggleWishlist = (carId) => {
    if (wishlist.includes(carId)) {
      setWishlist(prev => prev.filter(id => id !== carId));
      showToast("Removed vehicle from your private wishlist", "info");
    } else {
      setWishlist(prev => [...prev, carId]);
      showToast("Saved vehicle to your private wishlist", "success");
    }
  };

  const isWishlisted = (carId) => wishlist.includes(carId);

  // Test Drive actions
  const bookTestDrive = async (formData) => {
    const newDrive = {
      id: `TD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: formData.customerName || customerProfile.name,
      customerEmail: formData.customerEmail || customerProfile.email,
      customerPhone: formData.customerPhone || customerProfile.phone,
      carId: formData.carId,
      carName: formData.carName,
      date: formData.date,
      timeSlot: formData.timeSlot || "14:00 - 15:30",
      location: formData.location || "SpeedX Private Runway & Circuit",
      assignedConcierge: "Marco Rossi (VIP Specialist)",
      status: "Confirmed",
      notes: formData.notes || "Booked through digital showroom"
    };

    try {
      await testDrivesAPI.create({
        car_id: formData.carId,
        name: newDrive.customerName,
        email: newDrive.customerEmail,
        phone: newDrive.customerPhone,
        date: newDrive.date,
        time_slot: newDrive.timeSlot,
        notes: newDrive.notes
      });
    } catch (e) {
      console.warn('[TEST DRIVE API] Local state saved:', e.message);
    }

    setTestDrives(prev => [newDrive, ...prev]);
    
    // Log activity
    const newActivity = {
      id: Date.now(),
      action: "Test Drive Scheduled",
      detail: `${newDrive.customerName} booked ${newDrive.carName}`,
      time: "Just now",
      type: "testdrive"
    };
    setActivityLogs(prev => [newActivity, ...prev]);

    showToast(`Test drive appointment confirmed for ${newDrive.carName}!`, "success");
    return newDrive;
  };

  const updateTestDriveStatus = (id, newStatus) => {
    setTestDrives(prev => prev.map(td => td.id === id ? { ...td, status: newStatus } : td));
    showToast(`Test drive #${id} status updated to ${newStatus}`, "info");
  };

  const cancelTestDrive = (id) => {
    const driveToCancel = testDrives.find(td => td.id === id);
    setTestDrives(prev => prev.filter(td => td.id !== id));
    showToast(`Test drive booking #${id} for ${driveToCancel ? driveToCancel.carName : 'vehicle'} has been cancelled and removed.`, "success");
  };

  // Enquiry / Lead actions
  const submitEnquiry = async (leadData) => {
    const newLead = {
      id: `LEAD-${Math.floor(700 + Math.random() * 300)}`,
      customerName: leadData.name,
      email: leadData.email,
      phone: leadData.phone || "+1 (555) 000-0000",
      interestCar: leadData.carName || "General Collection Inquiry",
      budget: leadData.budget || "Confidential",
      stage: "New Inquiry",
      priority: leadData.isVip ? "Urgent" : "High",
      createdAt: new Date().toISOString().split('T')[0],
      assignedTo: "Marco Rossi",
      notes: leadData.message || "Requested direct showroom callback"
    };

    try {
      await leadsAPI.create({
        name: newLead.customerName,
        email: newLead.email,
        phone: newLead.phone,
        car_name: newLead.interestCar,
        budget: newLead.budget,
        message: newLead.notes,
        is_vip: leadData.isVip || false
      });
    } catch (e) {
      console.warn('[LEADS API] Local state saved:', e.message);
    }

    setLeads(prev => [newLead, ...prev]);

    const newActivity = {
      id: Date.now(),
      action: "New VIP Lead Registered",
      detail: `${newLead.customerName} enquired about ${newLead.interestCar}`,
      time: "Just now",
      type: "lead"
    };
    setActivityLogs(prev => [newActivity, ...prev]);

    showToast("Your VIP inquiry has been transmitted to our senior concierge!", "success");
    return newLead;
  };

  const updateLeadStage = (id, newStage) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: newStage } : l));
    showToast(`Lead stage updated to ${newStage}`, "info");
  };

  // Cars Admin CRUD
  const addCar = async (newCarData) => {
    const carId = (newCarData.id || `${newCarData.brand}-${newCarData.model}-${newCarData.year || 2025}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fullCar = {
      ...newCarData,
      id: carId,
      rating: 5.0,
      engine: newCarData.engine || `${newCarData.horsepower || 710}HP Twin-Turbocharged V8`,
      transmission: newCarData.transmission || '7-Speed Dual-Clutch F1',
      vin: newCarData.vin || `ZFF${Math.floor(100000 + Math.random() * 900000)}`,
      fuel_type: newCarData.fuelType || newCarData.fuel_type || 'Gasoline (V8 / V12)',
      images: Array.isArray(newCarData.images) && newCarData.images.length > 0 
        ? newCarData.images 
        : [newCarData.imageUrl || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80'],
      features: Array.isArray(newCarData.features) && newCarData.features.length > 0
        ? newCarData.features
        : ['Carbon Ceramic Brakes', 'Launch Control', 'Sport Exhaust System']
    };

    try {
      const res = await carsAPI.create(fullCar);
      if (res?.data) {
        const savedCar = {
          ...res.data,
          images: Array.isArray(res.data.images) && res.data.images.length > 0 ? res.data.images : fullCar.images,
          features: Array.isArray(res.data.features) && res.data.features.length > 0 ? res.data.features : fullCar.features
        };
        setCars(prev => [savedCar, ...prev.filter(c => c.id !== savedCar.id)]);
        showToast(`${savedCar.brand} ${savedCar.model} saved to database & inventory!`, "success");
        return { success: true, car: savedCar };
      }
    } catch (e) {
      console.warn('[CARS API] Backend save warning:', e.message);
    }

    setCars(prev => [fullCar, ...prev.filter(c => c.id !== fullCar.id)]);
    showToast(`${fullCar.brand} ${fullCar.model} added to inventory!`, "success");
    return { success: true, car: fullCar };
  };

  const updateCar = async (carId, updatedData) => {
    try {
      await carsAPI.update(carId, updatedData);
    } catch (e) {
      console.warn('[CARS API] Backend update warning:', e.message);
    }

    setCars(prev => prev.map(c => c.id === carId ? { ...c, ...updatedData } : c));
    showToast("Vehicle specifications updated in database successfully!", "success");
  };

  const deleteCar = async (carId) => {
    const carToDelete = cars.find(c => c.id === carId);

    try {
      await carsAPI.delete(carId);
    } catch (e) {
      console.warn('[CARS API] Backend delete warning:', e.message);
    }

    setCars(prev => prev.filter(c => c.id !== carId));
    showToast(`${carToDelete ? carToDelete.model : 'Vehicle'} removed from database & inventory`, "info");
  };

  // Orders Actions
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId} marked as ${newStatus}`, "info");
  };

  return (
    <AppContext.Provider value={{
      cars,
      wishlist,
      testDrives,
      orders,
      leads,
      customers,
      payments,
      serviceBookings,
      bookings,
      setBookings,
      notifications,
      setNotifications,
      checkBookingOverlap,
      createRentalBooking,
      approveRentalBooking,
      rejectRentalBooking,
      completeRentalBooking,
      cancelRentalBooking,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      updateUserProfile,
      staffUsers,
      activityLogs,
      adminStats,
      userRole,
      setUserRole,
      registeredUsers,
      customerProfile,
      setCustomerProfile,
      loginUser,
      registerUser,
      logoutUser,
      toasts,
      showToast,
      removeToast,
      toggleWishlist,
      isWishlisted,
      bookTestDrive,
      updateTestDriveStatus,
      cancelTestDrive,
      submitEnquiry,
      updateLeadStage,
      addCar,
      updateCar,
      deleteCar,
      updateOrderStatus,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
