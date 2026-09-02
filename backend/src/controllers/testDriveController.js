import { query, getClient } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const bookTestDrive = async (req, res) => {
  const client = await getClient();
  try {
    const customerId = req.user.id;
    const {
      car_id,
      preferred_date,
      preferred_time,
      location = 'Beverly Hills Private Circuit',
      message
    } = req.body;

    // Validate car exists
    const carCheck = await client.query('SELECT id, brand, model FROM cars WHERE id = $1', [car_id]);
    if (carCheck.rows.length === 0) {
      return errorResponse(res, 'Specified vehicle does not exist.', 404);
    }
    const car = carCheck.rows[0];

    await client.query('BEGIN');

    const insertSql = `
      INSERT INTO test_drives (
        customer_id, car_id, preferred_date, preferred_time, location, message, status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
      RETURNING *
    `;

    const testDriveRes = await client.query(insertSql, [
      customerId,
      car_id,
      preferred_date,
      preferred_time,
      location,
      message || null
    ]);

    // Create Notification for Customer
    await client.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, 'INFO')`,
      [
        customerId,
        'Test Drive Booking Received',
        `Your VIP test drive session request for the ${car.brand} ${car.model} is pending confirmation.`
      ]
    );

    await client.query('COMMIT');

    return successResponse(
      res,
      'Test drive booking submitted successfully. Our VIP Concierge will confirm your track schedule.',
      testDriveRes.rows[0],
      201
    );
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[BOOK_TEST_DRIVE ERROR]:', err);
    return errorResponse(res, 'Failed to book test drive.', 500);
  } finally {
    client.release();
  }
};

export const getMyTestDrives = async (req, res) => {
  try {
    const customerId = req.user.id;

    const drivesRes = await query(
      `SELECT 
        td.*,
        c.brand as car_brand,
        c.model as car_model,
        c.year as car_year,
        c.horsepower as car_horsepower,
        c.price as car_price,
        (SELECT img.image_url FROM car_images img WHERE img.car_id = c.id ORDER BY img.is_primary DESC, img.display_order ASC LIMIT 1) as car_image
      FROM test_drives td
      JOIN cars c ON td.car_id = c.id
      WHERE td.customer_id = $1
      ORDER BY td.preferred_date DESC, td.created_at DESC`,
      [customerId]
    );

    return successResponse(res, 'My test drives retrieved successfully', drivesRes.rows);
  } catch (err) {
    console.error('[GET_MY_TEST_DRIVES ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve test drives.', 500);
  }
};

export const getAllTestDrives = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = [];
    const values = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`td.status = $${paramIndex++}`);
      values.push(status.toUpperCase());
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countRes = await query(
      `SELECT COUNT(*) as total FROM test_drives td ${whereClause}`,
      values
    );
    const total = parseInt(countRes.rows[0].total, 10);
    const totalPages = Math.ceil(total / limitNum);

    const drivesQuery = `
      SELECT 
        td.*,
        u.name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        c.brand as car_brand,
        c.model as car_model,
        c.vin as car_vin,
        (SELECT img.image_url FROM car_images img WHERE img.car_id = c.id ORDER BY img.is_primary DESC, img.display_order ASC LIMIT 1) as car_image
      FROM test_drives td
      JOIN users u ON td.customer_id = u.id
      JOIN cars c ON td.car_id = c.id
      ${whereClause}
      ORDER BY td.preferred_date ASC, td.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    values.push(limitNum, offset);

    const drivesRes = await query(drivesQuery, values);

    return successResponse(res, 'All test drives retrieved successfully', drivesRes.rows, 200, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error('[GET_ALL_TEST_DRIVES ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve test drives.', 500);
  }
};

export const getTestDriveById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const driveRes = await query(
      `SELECT 
        td.*,
        u.name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        c.brand as car_brand,
        c.model as car_model,
        c.vin as car_vin,
        c.price as car_price,
        (SELECT img.image_url FROM car_images img WHERE img.car_id = c.id ORDER BY img.is_primary DESC, img.display_order ASC LIMIT 1) as car_image
      FROM test_drives td
      JOIN users u ON td.customer_id = u.id
      JOIN cars c ON td.car_id = c.id
      WHERE td.id = $1`,
      [id]
    );

    if (driveRes.rows.length === 0) {
      return errorResponse(res, 'Test drive appointment not found.', 404);
    }

    const drive = driveRes.rows[0];

    // Authorization check
    if (!isAdmin && drive.customer_id !== userId) {
      return errorResponse(res, 'Access denied. You cannot view another customer’s appointment.', 403);
    }

    return successResponse(res, 'Test drive details retrieved successfully', drive);
  } catch (err) {
    console.error('[GET_TEST_DRIVE_BY_ID ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve test drive.', 500);
  }
};

export const updateTestDriveStatus = async (req, res) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const { status, instructor, location } = req.body;

    await client.query('BEGIN');

    const updateRes = await client.query(
      `UPDATE test_drives SET
        status = COALESCE($1, status),
        instructor = COALESCE($2, instructor),
        location = COALESCE($3, location),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *`,
      [status, instructor, location, id]
    );

    if (updateRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return errorResponse(res, 'Test drive appointment not found.', 404);
    }

    const updatedDrive = updateRes.rows[0];

    // Notify customer
    await client.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, 'SUCCESS')`,
      [
        updatedDrive.customer_id,
        `Test Drive Status Updated: ${status}`,
        `Your test drive appointment status has been updated to ${status}.`
      ]
    );

    await client.query('COMMIT');

    return successResponse(res, 'Test drive status updated successfully', updatedDrive);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[UPDATE_TEST_DRIVE_STATUS ERROR]:', err);
    return errorResponse(res, 'Failed to update test drive.', 500);
  } finally {
    client.release();
  }
};
