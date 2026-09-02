import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    // 1. Cars summary
    const carsStatsRes = await query(`
      SELECT 
        COUNT(*) as total_cars,
        COUNT(*) FILTER (WHERE status = 'AVAILABLE') as available_cars,
        COUNT(*) FILTER (WHERE status = 'RESERVED') as reserved_cars,
        COUNT(*) FILTER (WHERE status = 'SOLD') as sold_cars,
        COALESCE(SUM(price) FILTER (WHERE status = 'AVAILABLE'), 0) as total_inventory_value
      FROM cars
    `);

    // 2. Customers count
    const customersCountRes = await query(`
      SELECT COUNT(*) as total_customers
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'CUSTOMER'
    `);

    // 3. Orders & Revenue
    const ordersStatsRes = await query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'PENDING') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'PROCESSING') as processing_orders,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_orders,
        COALESCE(SUM(amount) FILTER (WHERE status = 'COMPLETED'), 0) as total_revenue,
        COALESCE(SUM(deposit_paid), 0) as total_collected_deposits
      FROM orders
    `);

    // 4. Test drives & Leads
    const testDrivesCountRes = await query(`
      SELECT 
        COUNT(*) as total_test_drives,
        COUNT(*) FILTER (WHERE status = 'PENDING') as pending_test_drives,
        COUNT(*) FILTER (WHERE status = 'CONFIRMED') as confirmed_test_drives
      FROM test_drives
    `);

    const leadsCountRes = await query(`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(*) FILTER (WHERE status = 'NEW') as new_leads,
        COUNT(*) FILTER (WHERE status = 'QUALIFIED') as qualified_leads
      FROM leads
    `);

    const metrics = {
      cars: {
        total: parseInt(carsStatsRes.rows[0].total_cars, 10),
        available: parseInt(carsStatsRes.rows[0].available_cars, 10),
        reserved: parseInt(carsStatsRes.rows[0].reserved_cars, 10),
        sold: parseInt(carsStatsRes.rows[0].sold_cars, 10),
        inventoryValue: Number(carsStatsRes.rows[0].total_inventory_value)
      },
      customers: {
        total: parseInt(customersCountRes.rows[0].total_customers, 10)
      },
      orders: {
        total: parseInt(ordersStatsRes.rows[0].total_orders, 10),
        pending: parseInt(ordersStatsRes.rows[0].pending_orders, 10),
        processing: parseInt(ordersStatsRes.rows[0].processing_orders, 10),
        completed: parseInt(ordersStatsRes.rows[0].completed_orders, 10),
        totalRevenue: Number(ordersStatsRes.rows[0].total_revenue),
        totalCollectedDeposits: Number(ordersStatsRes.rows[0].total_collected_deposits)
      },
      testDrives: {
        total: parseInt(testDrivesCountRes.rows[0].total_test_drives, 10),
        pending: parseInt(testDrivesCountRes.rows[0].pending_test_drives, 10),
        confirmed: parseInt(testDrivesCountRes.rows[0].confirmed_test_drives, 10)
      },
      leads: {
        total: parseInt(leadsCountRes.rows[0].total_leads, 10),
        new: parseInt(leadsCountRes.rows[0].new_leads, 10),
        qualified: parseInt(leadsCountRes.rows[0].qualified_leads, 10)
      }
    };

    return successResponse(res, 'Dashboard metrics calculated successfully', metrics);
  } catch (err) {
    console.error('[GET_DASHBOARD_METRICS ERROR]:', err);
    return errorResponse(res, 'Failed to calculate dashboard metrics.', 500);
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const salesRes = await query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*) as orders_count,
        COALESCE(SUM(amount), 0) as total_volume,
        COALESCE(SUM(deposit_paid), 0) as total_deposits
      FROM orders
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12
    `);

    return successResponse(res, 'Sales volume report retrieved successfully', salesRes.rows);
  } catch (err) {
    console.error('[GET_SALES_REPORT ERROR]:', err);
    return errorResponse(res, 'Failed to generate sales report.', 500);
  }
};

export const getRevenueReport = async (req, res) => {
  try {
    const revenueRes = await query(`
      SELECT 
        payment_method,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM payments
      WHERE status = 'PAID'
      GROUP BY payment_method
      ORDER BY total_amount DESC
    `);

    return successResponse(res, 'Revenue breakdown retrieved successfully', revenueRes.rows);
  } catch (err) {
    console.error('[GET_REVENUE_REPORT ERROR]:', err);
    return errorResponse(res, 'Failed to generate revenue report.', 500);
  }
};

export const getTopBrands = async (req, res) => {
  try {
    const brandsRes = await query(`
      SELECT 
        brand,
        COUNT(*) as total_models,
        COALESCE(AVG(price), 0) as average_price,
        COALESCE(SUM(price), 0) as total_value
      FROM cars
      GROUP BY brand
      ORDER BY total_value DESC
    `);

    return successResponse(res, 'Top marques report retrieved successfully', brandsRes.rows);
  } catch (err) {
    console.error('[GET_TOP_BRANDS ERROR]:', err);
    return errorResponse(res, 'Failed to generate brand distribution report.', 500);
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const recentOrdersRes = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.amount,
        o.deposit_paid,
        o.status,
        o.payment_status,
        o.created_at,
        u.name as customer_name,
        u.email as customer_email,
        c.brand as car_brand,
        c.model as car_model
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN cars c ON o.car_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 6
    `);

    return successResponse(res, 'Recent orders retrieved successfully', recentOrdersRes.rows);
  } catch (err) {
    console.error('[GET_RECENT_ORDERS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve recent orders.', 500);
  }
};

export const getRecentLeads = async (req, res) => {
  try {
    const recentLeadsRes = await query(`
      SELECT 
        l.id,
        l.name,
        l.email,
        l.phone,
        l.budget,
        l.priority,
        l.status,
        l.created_at,
        c.brand as car_brand,
        c.model as car_model
      FROM leads l
      LEFT JOIN cars c ON l.car_id = c.id
      ORDER BY l.created_at DESC
      LIMIT 6
    `);

    return successResponse(res, 'Recent leads retrieved successfully', recentLeadsRes.rows);
  } catch (err) {
    console.error('[GET_RECENT_LEADS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve recent leads.', 500);
  }
};
