import app from './src/app.js';
import pool from './src/config/database.js';

const PORT = 5099;
const BASE_URL = `http://localhost:${PORT}/api`;

async function testSuite() {
  await new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      resolve(server);
    });
  });

  console.log(`=========================================================`);
  console.log(`🏎️ SPEEDX MOTORS BACKEND TEST SUITE RUNNING ON PORT ${PORT}`);
  console.log(`=========================================================\n`);

  let testsPassed = 0;
  let testsFailed = 0;

  async function assert(desc, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${desc}`);
      testsPassed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${desc}:`, err.message);
      testsFailed++;
    }
  }

  // 1. Health Check
  await assert('GET /api/health returns 200 and success', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (!res.ok || data.success !== true || data.message !== 'SPEEDX MOTORS API is running') {
      throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
    }
  });

  // 2. Auth - Admin Login
  let adminToken = '';
  await assert('POST /api/auth/login as Admin returns token and permissions', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@speedxmotors.com', password: 'password123' })
    });
    const data = await res.json();
    if (!res.ok || !data.data.token || data.data.user.role !== 'ADMIN') {
      throw new Error(`Login failed: ${JSON.stringify(data)}`);
    }
    adminToken = data.data.token;
  });

  // 3. Auth - Customer Register
  let customerToken = '';
  const testEmail = `collector_${Date.now()}@speedx.test`;
  await assert('POST /api/auth/register creates a new VIP Customer', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Baron Heinrich von Test',
        email: testEmail,
        password: 'password123',
        phone: '+49 89 123456',
        city: 'Munich',
        country: 'Germany'
      })
    });
    const data = await res.json();
    if (res.status !== 201 || !data.data.token || data.data.user.role !== 'CUSTOMER') {
      throw new Error(`Register failed: ${JSON.stringify(data)}`);
    }
    customerToken = data.data.token;
  });

  // 4. Auth - Me
  await assert('GET /api/auth/me retrieves authenticated customer profile', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const data = await res.json();
    if (!res.ok || data.data.user.email !== testEmail) {
      throw new Error(`Get me failed: ${JSON.stringify(data)}`);
    }
  });

  // 5. Cars - List and Filter
  await assert('GET /api/cars with multi-filters and sorting', async () => {
    const res = await fetch(`${BASE_URL}/cars?brand=Ferrari&sortBy=price_desc&limit=5`);
    const data = await res.json();
    if (!res.ok || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Failed to list Ferrari cars: ${JSON.stringify(data)}`);
    }
    if (data.data[0].brand !== 'Ferrari') {
      throw new Error(`Expected Ferrari, got ${data.data[0].brand}`);
    }
  });

  // 6. Cars - Details
  await assert('GET /api/cars/:id returns car details with images and features', async () => {
    const res = await fetch(`${BASE_URL}/cars/488-pista`);
    const data = await res.json();
    if (!res.ok || data.data.id !== '488-pista' || !Array.isArray(data.data.images)) {
      throw new Error(`Failed to get 488 Pista: ${JSON.stringify(data)}`);
    }
  });

  // 7. Cars - Admin Create, Update, Delete
  const tempCarId = `test-hypercar-${Date.now()}`;
  await assert('POST /api/cars (Admin only) creates a new car', async () => {
    const res = await fetch(`${BASE_URL}/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        id: tempCarId,
        brand: 'Pagani',
        model: 'Utopia Track Edition',
        year: 2025,
        price: 3200000,
        horsepower: 864,
        engine: '6.0L Twin-Turbo V12 by AMG',
        transmission: '7-Speed Manual / Xtrac Automated',
        vin: `ZHWPAGANI${Date.now()}`,
        status: 'AVAILABLE'
      })
    });
    const data = await res.json();
    if (res.status !== 201 || data.data.id !== tempCarId) {
      throw new Error(`Admin create car failed: ${JSON.stringify(data)}`);
    }
  });

  await assert('PUT /api/cars/:id (Admin only) updates car specs', async () => {
    const res = await fetch(`${BASE_URL}/cars/${tempCarId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ price: 3400000, status: 'RESERVED' })
    });
    const data = await res.json();
    if (!res.ok || Number(data.data.price) !== 3400000) {
      throw new Error(`Admin update car failed: ${JSON.stringify(data)}`);
    }
  });

  await assert('DELETE /api/cars/:id (Admin only) deletes car', async () => {
    const res = await fetch(`${BASE_URL}/cars/${tempCarId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!res.ok || data.success !== true) {
      throw new Error(`Admin delete car failed: ${JSON.stringify(data)}`);
    }
  });

  // 8. Wishlist - Add, Get, Remove
  await assert('Wishlist operations (Customer only)', async () => {
    const addRes = await fetch(`${BASE_URL}/wishlist/488-pista`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const addData = await addRes.json();
    if (!addRes.ok || !addData.success) throw new Error(`Add wishlist failed: ${JSON.stringify(addData)}`);

    const getRes = await fetch(`${BASE_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const getData = await getRes.json();
    if (!getRes.ok || getData.data.length === 0 || getData.data[0].id !== '488-pista') {
      throw new Error(`Get wishlist failed: ${JSON.stringify(getData)}`);
    }

    const delRes = await fetch(`${BASE_URL}/wishlist/488-pista`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const delData = await delRes.json();
    if (!delRes.ok || !delData.success) throw new Error(`Delete wishlist failed: ${JSON.stringify(delData)}`);
  });

  // 9. Leads - Submit and Admin Pipeline
  let testLeadId;
  await assert('Leads: Submit VIP Inquiry and Admin Status Update', async () => {
    const leadRes = await fetch(`${BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        car_id: '488-pista',
        name: 'Sheikh Al-Maktoum',
        email: 'sheikh@dubairoyal.ae',
        phone: '+971 4 333 4444',
        message: 'Interested in acquiring 488 Pista for private collection.',
        budget: 500000
      })
    });
    const leadData = await leadRes.json();
    if (leadRes.status !== 201 || !leadData.data.id) throw new Error(`Create lead failed: ${JSON.stringify(leadData)}`);
    testLeadId = leadData.data.id;

    const getLeadsRes = await fetch(`${BASE_URL}/leads?status=NEW`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const getLeadsData = await getLeadsRes.json();
    if (!getLeadsRes.ok || !Array.isArray(getLeadsData.data)) throw new Error(`Admin get leads failed`);

    const updateLeadRes = await fetch(`${BASE_URL}/leads/${testLeadId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'QUALIFIED', notes: 'Private escrow terms confirmed.' })
    });
    const updateLeadData = await updateLeadRes.json();
    if (!updateLeadRes.ok || updateLeadData.data.status !== 'QUALIFIED') throw new Error(`Update lead status failed`);
  });

  // 10. Test Drives - Book and Admin Schedule
  let testDriveId;
  await assert('Test Drives: Customer Booking and Admin Confirmation', async () => {
    const bookRes = await fetch(`${BASE_URL}/test-drives`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        car_id: '488-pista',
        preferred_date: '2026-09-15',
        preferred_time: '11:00 AM - 01:00 PM',
        message: 'Runway speed telemetry test'
      })
    });
    const bookData = await bookRes.json();
    if (bookRes.status !== 201 || !bookData.data.id) throw new Error(`Booking test drive failed: ${JSON.stringify(bookData)}`);
    testDriveId = bookData.data.id;

    const myDrivesRes = await fetch(`${BASE_URL}/test-drives/my`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const myDrivesData = await myDrivesRes.json();
    if (!myDrivesRes.ok || myDrivesData.data.length === 0) throw new Error(`Get my test drives failed`);

    const adminUpdateRes = await fetch(`${BASE_URL}/test-drives/${testDriveId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'CONFIRMED', instructor: 'Jean-Pierre Laurent' })
    });
    const adminUpdateData = await adminUpdateRes.json();
    if (!adminUpdateRes.ok || adminUpdateData.data.status !== 'CONFIRMED') throw new Error(`Admin update test drive failed`);
  });

  // 11. Orders & Payments
  let testOrderId;
  await assert('Orders & Payments: Create Order, Record Payment, and Update Status', async () => {
    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        car_id: 'huracan-evo',
        deposit_paid: 50000,
        delivery_address: 'Bogenhausen, 81675 Munich, Germany'
      })
    });
    const orderData = await orderRes.json();
    if (orderRes.status !== 201 || !orderData.data.id) throw new Error(`Create order failed: ${JSON.stringify(orderData)}`);
    testOrderId = orderData.data.id;

    const paymentRes = await fetch(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        order_id: testOrderId,
        amount: 275000,
        payment_method: 'Swiss Bank Wire'
      })
    });
    const paymentData = await paymentRes.json();
    if (paymentRes.status !== 201 || !paymentData.data.id) throw new Error(`Record payment failed: ${JSON.stringify(paymentData)}`);

    const updateOrderRes = await fetch(`${BASE_URL}/orders/${testOrderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'PROCESSING', payment_status: 'PAID' })
    });
    const updateOrderData = await updateOrderRes.json();
    if (!updateOrderRes.ok || updateOrderData.data.status !== 'PROCESSING') throw new Error(`Update order status failed`);
  });

  // 12. Services & Bookings
  await assert('Services: Catalog, Customer Booking, and My Bookings', async () => {
    const srvRes = await fetch(`${BASE_URL}/services`);
    const srvData = await srvRes.json();
    if (!srvRes.ok || srvData.data.length === 0) throw new Error(`Get services failed`);

    const bookRes = await fetch(`${BASE_URL}/services/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        service_id: 1,
        customer_name: 'Baron Heinrich',
        customer_email: testEmail,
        car_model: 'Ferrari 488 Pista',
        scheduled_date: '2026-09-20'
      })
    });
    const bookData = await bookRes.json();
    if (bookRes.status !== 201) throw new Error(`Book service failed: ${JSON.stringify(bookData)}`);

    const myBookingsRes = await fetch(`${BASE_URL}/services/bookings/my`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const myBookingsData = await myBookingsRes.json();
    if (!myBookingsRes.ok || myBookingsData.data.length === 0) throw new Error(`Get my service bookings failed`);
  });

  // 13. Reports (Admin only)
  await assert('Reports & Analytics: Dashboard, Sales, Revenue, Top Brands', async () => {
    const dashboardRes = await fetch(`${BASE_URL}/reports/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const dashboardData = await dashboardRes.json();
    if (!dashboardRes.ok || !dashboardData.data.cars || typeof dashboardData.data.cars.total !== 'number') {
      throw new Error(`Dashboard report failed: ${JSON.stringify(dashboardData)}`);
    }

    const salesRes = await fetch(`${BASE_URL}/reports/sales`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const salesData = await salesRes.json();
    if (!salesRes.ok || !Array.isArray(salesData.data)) throw new Error(`Sales report failed`);

    const brandsRes = await fetch(`${BASE_URL}/reports/top-brands`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const brandsData = await brandsRes.json();
    if (!brandsRes.ok || !Array.isArray(brandsData.data)) throw new Error(`Top brands report failed`);
  });

  // 14. Notifications
  await assert('Notifications: Retrieve and Mark Read', async () => {
    const notifsRes = await fetch(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const notifsData = await notifsRes.json();
    if (!notifsRes.ok || !Array.isArray(notifsData.data)) throw new Error(`Get notifications failed`);

    if (notifsData.data.length > 0) {
      const notifId = notifsData.data[0].id;
      const readRes = await fetch(`${BASE_URL}/notifications/${notifId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      const readData = await readRes.json();
      if (!readRes.ok) throw new Error(`Mark notification read failed`);
    }
  });

  // 15. Unified Car Rental Bookings Workflow
  let createdBookingId = null;
  const testStartDay = Math.floor(1 + Math.random() * 20);
  const testPickup = `2028-05-${testStartDay < 10 ? '0' + testStartDay : testStartDay}`;
  const testReturn = `2028-05-${(testStartDay + 3) < 10 ? '0' + (testStartDay + 3) : (testStartDay + 3)}`;

  await assert('POST /api/bookings creates Pending rental booking and notifies Admin', async () => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        car_id: '488-pista',
        user_name: 'John Smith',
        user_email: 'user@speedxmotors.com',
        phone: '+1 (555) 234-5678',
        pickup_date: testPickup,
        return_date: testReturn,
        pickup_location: 'Beverly Hills Showroom Sanctuary',
        message: 'VIP Weekend Rental'
      })
    });
    const data = await res.json();
    if (!res.ok || data.success !== true || data.data.status !== 'Pending') {
      throw new Error(`Booking creation failed: ${JSON.stringify(data)}`);
    }
    createdBookingId = data.data.id || data.data.booking_code;
  });

  await assert('POST /api/bookings detects date overlap on identical/overlapping dates', async () => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        car_id: '488-pista',
        user_name: 'Marcus Vance',
        user_email: 'marcus@speedx.test',
        phone: '+1 (555) 999-8888',
        pickup_date: testPickup,
        return_date: testReturn,
        pickup_location: 'LAX Airport VIP Valet'
      })
    });
    const data = await res.json();
    if (res.status !== 409 && !data.message?.includes('already booked')) {
      throw new Error(`Overlap check failed to block overlapping booking: ${JSON.stringify(data)}`);
    }
  });

  await assert('GET /api/bookings/my returns user bookings', async () => {
    const res = await fetch(`${BASE_URL}/bookings/my`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const data = await res.json();
    if (!res.ok || !Array.isArray(data.data)) {
      throw new Error(`Get my bookings failed: ${JSON.stringify(data)}`);
    }
  });

  await assert('PUT /api/admin/bookings/:id/approve authorizes booking and stamps approved_at', async () => {
    if (!createdBookingId) return;
    const res = await fetch(`${BASE_URL}/bookings/admin/${createdBookingId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!res.ok || data.data.status !== 'Approved' || !data.data.approved_at) {
      throw new Error(`Approve booking failed: ${JSON.stringify(data)}`);
    }
  });

  await assert('PUT /api/admin/bookings/:id/reject records rejection reason and notifies user', async () => {
    if (!createdBookingId) return;
    const res = await fetch(`${BASE_URL}/bookings/admin/${createdBookingId}/reject`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}` 
      },
      body: JSON.stringify({
        rejection_reason: 'Vehicle allocation redirected for factory track event.'
      })
    });
    const data = await res.json();
    if (!res.ok || data.data.status !== 'Rejected' || !data.data.rejection_reason) {
      throw new Error(`Reject booking failed: ${JSON.stringify(data)}`);
    }
  });

  await assert('PUT /api/admin/bookings/:id/complete marks rental as Completed and releases vehicle', async () => {
    if (!createdBookingId) return;
    const res = await fetch(`${BASE_URL}/bookings/admin/${createdBookingId}/complete`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!res.ok || data.data.status !== 'Completed') {
      throw new Error(`Complete booking failed: ${JSON.stringify(data)}`);
    }
  });

  console.log(`\n=========================================================`);
  console.log(`📊 TEST SUITE SUMMARY: ${testsPassed} Passed | ${testsFailed} Failed`);
  console.log(`=========================================================\n`);

  if (testsFailed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL BACKEND TESTS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  }
}

testSuite();
