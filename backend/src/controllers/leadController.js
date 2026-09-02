import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createLead = async (req, res) => {
  try {
    const {
      car_id,
      name,
      email,
      phone,
      message,
      source = 'Website VIP Form',
      budget,
      priority = 'High'
    } = req.body;

    const customerId = req.user ? req.user.id : null;

    const insertSql = `
      INSERT INTO leads (
        customer_id, car_id, name, email, phone, message, source, budget, priority, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'NEW')
      RETURNING *
    `;

    const leadRes = await query(insertSql, [
      customerId,
      car_id || null,
      name.trim(),
      email.toLowerCase().trim(),
      phone || null,
      message || null,
      source,
      budget ? Number(budget) : null,
      priority
    ]);

    return successResponse(
      res,
      'Your VIP inquiry has been registered. Our Concierge will reach out promptly.',
      leadRes.rows[0],
      201
    );
  } catch (err) {
    console.error('[CREATE_LEAD ERROR]:', err);
    return errorResponse(res, 'Failed to submit inquiry.', 500);
  }
};

export const getLeads = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = [];
    const values = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`l.status = $${paramIndex++}`);
      values.push(status.toUpperCase());
    }

    if (priority) {
      whereConditions.push(`LOWER(l.priority) = LOWER($${paramIndex++})`);
      values.push(priority);
    }

    if (search) {
      whereConditions.push(
        `(LOWER(l.name) LIKE LOWER($${paramIndex}) OR LOWER(l.email) LIKE LOWER($${paramIndex}) OR LOWER(l.phone) LIKE LOWER($${paramIndex}) OR LOWER(c.model) LIKE LOWER($${paramIndex}))`
      );
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countRes = await query(
      `SELECT COUNT(*) as total FROM leads l LEFT JOIN cars c ON l.car_id = c.id ${whereClause}`,
      values
    );
    const total = parseInt(countRes.rows[0].total, 10);
    const totalPages = Math.ceil(total / limitNum);

    const leadsQuery = `
      SELECT 
        l.*,
        c.brand as car_brand,
        c.model as car_model,
        c.price as car_price
      FROM leads l
      LEFT JOIN cars c ON l.car_id = c.id
      ${whereClause}
      ORDER BY l.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    values.push(limitNum, offset);

    const leadsRes = await query(leadsQuery, values);

    return successResponse(res, 'Leads retrieved successfully', leadsRes.rows, 200, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error('[GET_LEADS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve leads.', 500);
  }
};

export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const leadRes = await query(
      `SELECT 
        l.*,
        c.brand as car_brand,
        c.model as car_model,
        c.price as car_price,
        c.vin as car_vin
      FROM leads l
      LEFT JOIN cars c ON l.car_id = c.id
      WHERE l.id = $1`,
      [id]
    );

    if (leadRes.rows.length === 0) {
      return errorResponse(res, 'Lead not found.', 404);
    }

    return successResponse(res, 'Lead details retrieved successfully', leadRes.rows[0]);
  } catch (err) {
    console.error('[GET_LEAD_BY_ID ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve lead.', 500);
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assigned_to, priority } = req.body;

    const updateRes = await query(
      `UPDATE leads SET
        status = COALESCE($1, status),
        notes = COALESCE($2, notes),
        assigned_to = COALESCE($3, assigned_to),
        priority = COALESCE($4, priority),
        updated_at = NOW()
      WHERE id = $5
      RETURNING *`,
      [status, notes, assigned_to, priority, id]
    );

    if (updateRes.rows.length === 0) {
      return errorResponse(res, 'Lead not found.', 404);
    }

    return successResponse(res, 'Lead updated successfully', updateRes.rows[0]);
  } catch (err) {
    console.error('[UPDATE_LEAD_STATUS ERROR]:', err);
    return errorResponse(res, 'Failed to update lead.', 500);
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRes = await query('DELETE FROM leads WHERE id = $1 RETURNING id', [id]);

    if (deleteRes.rows.length === 0) {
      return errorResponse(res, 'Lead not found.', 404);
    }

    return successResponse(res, 'Lead deleted successfully.');
  } catch (err) {
    console.error('[DELETE_LEAD ERROR]:', err);
    return errorResponse(res, 'Failed to delete lead.', 500);
  }
};
