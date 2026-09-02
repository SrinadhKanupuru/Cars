export const initialBookings = [];

export const initialNotifications = [
  {
    id: "notif-welcome",
    user_id: "user-1",
    user_email: "user@speedxmotors.com",
    target_role: "customer",
    title: "Welcome to SPEEDX Rentals",
    message: "Browse our premier collection of supercars and submit your rental requests with instant tracking.",
    type: "INFO",
    booking_id: null,
    is_read: false,
    created_at: new Date().toISOString()
  }
];
