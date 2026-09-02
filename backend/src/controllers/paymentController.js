import { query, getClient } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const recordPayment = async (req, res) => {
  const client = await getClient();
  try {
    const customerId = req.user.id;
    const {
      order_id,
      amount,
      payment_method,
      transaction_reference,
      notes
    } = req.body;

    // Validate order exists and belongs to user (or if admin is recording)
    const orderRes = await client.query('SELECT * FROM orders WHERE id = $1', [order_id]);
    if (orderRes.rows.length === 0) {
      return errorResponse(res, 'Order not found.', 404);
    }
    const order = orderRes.rows[0];

    if (req.user.role !== 'ADMIN' && order.customer_id !== customerId) {
      return errorResponse(res, 'Access denied. You cannot pay for another client’s order.', 403);
    }

    const txRef = transaction_reference || `TX-SX-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    await client.query('BEGIN');

    const insertSql = `
      INSERT INTO payments (
        order_id, customer_id, amount, payment_method, status, transaction_reference, notes
      ) VALUES ($1, $2, $3, $4, 'PAID', $5, $6)
      RETURNING *
    `;

    const paymentRes = await client.query(insertSql, [
      order_id,
      order.customer_id,
      Number(amount),
      payment_method,
      txRef,
      notes || null
    ]);

    const newPayment = paymentRes.rows[0];

    // Update order deposit/payment status
    const newDepositTotal = Number(order.deposit_paid || 0) + Number(amount);
    const newPaymentStatus = newDepositTotal >= Number(order.amount) ? 'PAID' : 'PARTIALLY_PAID';

    await client.query(
      `UPDATE orders SET
        deposit_paid = $1,
        payment_status = $2,
        updated_at = NOW()
      WHERE id = $3`,
      [newDepositTotal, newPaymentStatus, order_id]
    );

    // Notify Customer
    await client.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, 'SUCCESS')`,
      [
        order.customer_id,
        'Payment Receipt Verified',
        `Payment of $${Number(amount).toLocaleString()} via ${payment_method} has been received for order #${order.order_number}. Ref: ${txRef}`
      ]
    );

    await client.query('COMMIT');

    return successResponse(res, 'Payment recorded successfully.', newPayment, 201);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[RECORD_PAYMENT ERROR]:', err);
    return errorResponse(res, 'Failed to record payment.', 500);
  } finally {
    client.release();
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const customerId = req.user.id;

    const paymentsRes = await query(
      `SELECT 
        p.*,
        o.order_number,
        o.amount as order_total_amount,
        c.brand as car_brand,
        c.model as car_model
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      JOIN cars c ON o.car_id = c.id
      WHERE p.customer_id = $1
      ORDER BY p.created_at DESC`,
      [customerId]
    );

    return successResponse(res, 'My payments retrieved successfully', paymentsRes.rows);
  } catch (err) {
    console.error('[GET_MY_PAYMENTS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve payments.', 500);
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = [];
    const values = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`p.status = $${paramIndex++}`);
      values.push(status.toUpperCase());
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countRes = await query(`SELECT COUNT(*) as total FROM payments p ${whereClause}`, values);
    const total = parseInt(countRes.rows[0].total, 10);
    const totalPages = Math.ceil(total / limitNum);

    const paymentsQuery = `
      SELECT 
        p.*,
        u.name as customer_name,
        u.email as customer_email,
        o.order_number,
        c.brand as car_brand,
        c.model as car_model
      FROM payments p
      JOIN users u ON p.customer_id = u.id
      JOIN orders o ON p.order_id = o.id
      JOIN cars c ON o.car_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    values.push(limitNum, offset);

    const paymentsRes = await query(paymentsQuery, values);

    return successResponse(res, 'All payments retrieved successfully', paymentsRes.rows, 200, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error('[GET_ALL_PAYMENTS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve payments.', 500);
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const paymentRes = await query(
      `SELECT 
        p.*,
        u.name as customer_name,
        u.email as customer_email,
        o.order_number,
        o.amount as order_amount,
        c.brand as car_brand,
        c.model as car_model,
        c.vin as car_vin
      FROM payments p
      JOIN users u ON p.customer_id = u.id
      JOIN orders o ON p.order_id = o.id
      JOIN cars c ON o.car_id = c.id
      WHERE p.id = $1`,
      [id]
    );

    if (paymentRes.rows.length === 0) {
      return errorResponse(res, 'Payment transaction record not found.', 404);
    }

    const payment = paymentRes.rows[0];

    if (!isAdmin && payment.customer_id !== userId) {
      return errorResponse(res, 'Access denied. You cannot view another customer’s payment receipt.', 403);
    }

    return successResponse(res, 'Payment receipt retrieved successfully', payment);
  } catch (err) {
    console.error('[GET_PAYMENT_BY_ID ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve payment record.', 500);
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateRes = await query(
      `UPDATE payments SET
        status = COALESCE($1, status),
        notes = COALESCE($2, notes),
        updated_at = NOW()
      WHERE id = $3
      RETURNING *`,
      [status, notes, id]
    );

    if (updateRes.rows.length === 0) {
      return errorResponse(res, 'Payment record not found.', 404);
    }

    return successResponse(res, 'Payment record status updated successfully', updateRes.rows[0]);
  } catch (err) {
    console.error('[UPDATE_PAYMENT_STATUS ERROR]:', err);
    return errorResponse(res, 'Failed to update payment status.', 500);
  }
};
