import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

// ==========================================
// Dealership Services
// ==========================================

export const getAllServices = async (req, res) => {
  try {
    const servicesRes = await query(
      `SELECT * FROM services WHERE is_active = true ORDER BY id ASC`
    );
    return successResponse(res, 'Services retrieved successfully', servicesRes.rows);
  } catch (err) {
    console.error('[GET_ALL_SERVICES ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve services.', 500);
  }
};

export const createService = async (req, res) => {
  try {
    const {
      title,
      category,
      short_desc,
      full_desc,
      price_range,
      timeline,
      icon
    } = req.body;

    const insertSql = `
      INSERT INTO services (
        title, category, short_desc, full_desc, price_range, timeline, icon, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING *
    `;

    const srvRes = await query(insertSql, [
      title, category, short_desc || null, full_desc || null, price_range || null,
      timeline || null, icon || 'Zap'
    ]);

    return successResponse(res, 'Service created successfully', srvRes.rows[0], 201);
  } catch (err) {
    console.error('[CREATE_SERVICE ERROR]:', err);
    return errorResponse(res, 'Failed to create service.', 500);
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      short_desc,
      full_desc,
      price_range,
      timeline,
      icon,
      is_active
    } = req.body;

    const updateSql = `
      UPDATE services SET
        title = COALESCE($1, title),
        category = COALESCE($2, category),
        short_desc = COALESCE($3, short_desc),
        full_desc = COALESCE($4, full_desc),
        price_range = COALESCE($5, price_range),
        timeline = COALESCE($6, timeline),
        icon = COALESCE($7, icon),
        is_active = COALESCE($8, is_active),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const srvRes = await query(updateSql, [
      title, category, short_desc, full_desc, price_range, timeline, icon, is_active, id
    ]);

    if (srvRes.rows.length === 0) {
      return errorResponse(res, 'Service not found.', 404);
    }

    return successResponse(res, 'Service updated successfully', srvRes.rows[0]);
  } catch (err) {
    console.error('[UPDATE_SERVICE ERROR]:', err);
    return errorResponse(res, 'Failed to update service.', 500);
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRes = await query('DELETE FROM services WHERE id = $1 RETURNING id', [id]);

    if (deleteRes.rows.length === 0) {
      return errorResponse(res, 'Service not found.', 404);
    }

    return successResponse(res, 'Service deleted successfully.');
  } catch (err) {
    console.error('[DELETE_SERVICE ERROR]:', err);
    return errorResponse(res, 'Failed to delete service.', 500);
  }
};

// ==========================================
// Service Bookings
// ==========================================

export const bookService = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const {
      service_id,
      customer_name,
      customer_email,
      customer_phone,
      car_model,
      scheduled_date,
      notes
    } = req.body;

    // Validate service exists
    const srvCheck = await query('SELECT id, title FROM services WHERE id = $1', [service_id]);
    if (srvCheck.rows.length === 0) {
      return errorResponse(res, 'Specified dealership service not found.', 404);
    }

    const insertSql = `
      INSERT INTO service_bookings (
        user_id, service_id, customer_name, customer_email, customer_phone,
        car_model, scheduled_date, notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
      RETURNING *
    `;

    const bookingRes = await query(insertSql, [
      userId,
      service_id,
      customer_name,
      customer_email,
      customer_phone || null,
      car_model,
      scheduled_date,
      notes || null
    ]);

    return successResponse(
      res,
      'Service bay booking submitted successfully. Our master technicians will prepare the workshop schedule.',
      bookingRes.rows[0],
      201
    );
  } catch (err) {
    console.error('[BOOK_SERVICE ERROR]:', err);
    return errorResponse(res, 'Failed to book service appointment.', 500);
  }
};

export const getMyServiceBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookingsRes = await query(
      `SELECT 
        sb.*,
        s.title as service_title,
        s.category as service_category,
        s.price_range as service_price_range
      FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      WHERE sb.user_id = $1
      ORDER BY sb.scheduled_date DESC`,
      [userId]
    );

    return successResponse(res, 'My service bookings retrieved successfully', bookingsRes.rows);
  } catch (err) {
    console.error('[GET_MY_SERVICE_BOOKINGS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve service bookings.', 500);
  }
};

export const getAllServiceBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = [];
    const values = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`sb.status = $${paramIndex++}`);
      values.push(status.toUpperCase());
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countRes = await query(`SELECT COUNT(*) as total FROM service_bookings sb ${whereClause}`, values);
    const total = parseInt(countRes.rows[0].total, 10);
    const totalPages = Math.ceil(total / limitNum);

    const bookingsQuery = `
      SELECT 
        sb.*,
        s.title as service_title,
        s.category as service_category
      FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      ${whereClause}
      ORDER BY sb.scheduled_date ASC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    values.push(limitNum, offset);

    const bookingsRes = await query(bookingsQuery, values);

    return successResponse(res, 'All service bookings retrieved successfully', bookingsRes.rows, 200, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error('[GET_ALL_SERVICE_BOOKINGS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve service bookings.', 500);
  }
};

export const updateServiceBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, bay_number, technician, notes } = req.body;

    const updateRes = await query(
      `UPDATE service_bookings SET
        status = COALESCE($1, status),
        bay_number = COALESCE($2, bay_number),
        technician = COALESCE($3, technician),
        notes = COALESCE($4, notes),
        updated_at = NOW()
      WHERE id = $5
      RETURNING *`,
      [status, bay_number, technician, notes, id]
    );

    if (updateRes.rows.length === 0) {
      return errorResponse(res, 'Service booking not found.', 404);
    }

    return successResponse(res, 'Service booking status updated successfully', updateRes.rows[0]);
  } catch (err) {
    console.error('[UPDATE_SERVICE_BOOKING_STATUS ERROR]:', err);
    return errorResponse(res, 'Failed to update service booking status.', 500);
  }
};
