import { query, getClient } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profileRes = await query(
      `SELECT 
        u.id as user_id,
        u.name,
        u.email,
        u.phone,
        u.avatar,
        u.status,
        u.created_at as member_since,
        r.name as role,
        c.id as customer_id,
        COALESCE(c.membership_tier, 'Gold Apex Collector') as membership_tier,
        COALESCE(c.total_purchases, 0) as total_purchases,
        COALESCE(c.total_spent, 0) as total_spent,
        c.address,
        c.city,
        c.country,
        c.preferred_brands,
        c.notes
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN customers c ON u.id = c.user_id
      WHERE u.id = $1`,
      [userId]
    );

    if (profileRes.rows.length === 0) {
      return errorResponse(res, 'Profile not found.', 404);
    }

    return successResponse(res, 'Customer profile retrieved successfully', profileRes.rows[0]);
  } catch (err) {
    console.error('[GET_MY_PROFILE ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve profile.', 500);
  }
};

export const updateMyProfile = async (req, res) => {
  const client = await getClient();
  try {
    const userId = req.user.id;
    const { name, phone, address, city, country, preferred_brands, avatar } = req.body;

    await client.query('BEGIN');

    // Update users table
    if (name || phone || avatar) {
      await client.query(
        `UPDATE users SET
          name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          avatar = COALESCE($3, avatar),
          updated_at = NOW()
        WHERE id = $4`,
        [name, phone, avatar, userId]
      );
    }

    // Upsert customers table
    const custRes = await client.query(
      `INSERT INTO customers (user_id, address, city, country, preferred_brands)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET
        address = COALESCE(EXCLUDED.address, customers.address),
        city = COALESCE(EXCLUDED.city, customers.city),
        country = COALESCE(EXCLUDED.country, customers.country),
        preferred_brands = COALESCE(EXCLUDED.preferred_brands, customers.preferred_brands),
        updated_at = NOW()
       RETURNING *`,
      [userId, address, city, country, preferred_brands]
    );

    await client.query('COMMIT');

    return successResponse(res, 'Profile updated successfully', custRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[UPDATE_MY_PROFILE ERROR]:', err);
    return errorResponse(res, 'Failed to update profile.', 500);
  } finally {
    client.release();
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const { search, membershipTier, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = ["r.name = 'CUSTOMER'"];
    const values = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(
        `(LOWER(u.name) LIKE LOWER($${paramIndex}) OR LOWER(u.email) LIKE LOWER($${paramIndex}) OR LOWER(u.phone) LIKE LOWER($${paramIndex}))`
      );
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (membershipTier) {
      whereConditions.push(`LOWER(c.membership_tier) = LOWER($${paramIndex++})`);
      values.push(membershipTier);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const countRes = await query(
      `SELECT COUNT(*) as total
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN customers c ON u.id = c.user_id
       ${whereClause}`,
      values
    );
    const total = parseInt(countRes.rows[0].total, 10);
    const totalPages = Math.ceil(total / limitNum);

    const customersQuery = `
      SELECT 
        u.id as user_id,
        u.name,
        u.email,
        u.phone,
        u.status,
        u.avatar,
        u.created_at as joined_date,
        c.id as customer_id,
        COALESCE(c.membership_tier, 'Gold Apex Collector') as membership_tier,
        COALESCE(c.total_purchases, 0) as total_purchases,
        COALESCE(c.total_spent, 0) as total_spent,
        c.city,
        c.country,
        c.preferred_brands
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN customers c ON u.id = c.user_id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    values.push(limitNum, offset);

    const customersRes = await query(customersQuery, values);

    return successResponse(res, 'Customers list retrieved successfully', customersRes.rows, 200, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error('[GET_ALL_CUSTOMERS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve customers.', 500);
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const custRes = await query(
      `SELECT 
        u.id as user_id,
        u.name,
        u.email,
        u.phone,
        u.status,
        u.avatar,
        u.created_at,
        c.id as customer_id,
        c.membership_tier,
        c.total_purchases,
        c.total_spent,
        c.address,
        c.city,
        c.country,
        c.preferred_brands,
        c.notes
      FROM users u
      LEFT JOIN customers c ON u.id = c.user_id
      WHERE u.id = $1`,
      [id]
    );

    if (custRes.rows.length === 0) {
      return errorResponse(res, 'Customer not found.', 404);
    }

    return successResponse(res, 'Customer dossier retrieved successfully', custRes.rows[0]);
  } catch (err) {
    console.error('[GET_CUSTOMER_BY_ID ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve customer dossier.', 500);
  }
};
