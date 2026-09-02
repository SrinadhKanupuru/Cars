import { query, getClient } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createOrder = async (req, res) => {
  const client = await getClient();
  try {
    const customerId = req.user.id;
    const {
      car_id,
      amount,
      deposit_paid = 0,
      delivery_address,
      notes
    } = req.body;

    // Check car exists
    const carRes = await client.query('SELECT * FROM cars WHERE id = $1', [car_id]);
    if (carRes.rows.length === 0) {
      return errorResponse(res, 'Specified vehicle does not exist in inventory.', 404);
    }
    const car = carRes.rows[0];

    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalAmount = amount ? Number(amount) : Number(car.price);
    const depositAmount = Number(deposit_paid) || 0;

    await client.query('BEGIN');

    // Create Order
    const insertSql = `
      INSERT INTO orders (
        order_number, customer_id, car_id, vin, amount, deposit_paid,
        delivery_address, estimated_delivery, status, payment_status, notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, CURRENT_DATE + INTERVAL '14 days', 'PENDING',
        $8, $9
      ) RETURNING *
    `;

    const paymentStatus = depositAmount >= finalAmount ? 'PAID' : (depositAmount > 0 ? 'PARTIALLY_PAID' : 'PENDING');

    const orderRes = await client.query(insertSql, [
      orderNumber,
      customerId,
      car_id,
      car.vin,
      finalAmount,
      depositAmount,
      delivery_address || null,
      paymentStatus,
      notes || null
    ]);

    const newOrder = orderRes.rows[0];

    // Update car status to RESERVED
    await client.query("UPDATE cars SET status = 'RESERVED', updated_at = NOW() WHERE id = $1", [car_id]);

    // Create Notification
    await client.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, 'SUCCESS')`,
      [
        customerId,
        `Vehicle Order Dossier Created #${orderNumber}`,
        `Your allocation reservation for the ${car.brand} ${car.model} has been initiated.`
      ]
    );

    await client.query('COMMIT');

    return successResponse(res, 'Vehicle order created successfully.', newOrder, 201);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[CREATE_ORDER ERROR]:', err);
    return errorResponse(res, 'Failed to create order.', 500);
  } finally {
    client.release();
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.id;

    const ordersRes = await query(
      `SELECT 
        o.*,
        c.brand as car_brand,
        c.model as car_model,
        c.year as car_year,
        c.engine as car_engine,
        c.horsepower as car_horsepower,
        c.transmission as car_transmission,
        (SELECT img.image_url FROM car_images img WHERE img.car_id = c.id ORDER BY img.is_primary DESC, img.display_order ASC LIMIT 1) as car_image
      FROM orders o
      JOIN cars c ON o.car_id = c.id
      WHERE o.customer_id = $1
      ORDER BY o.created_at DESC`,
      [customerId]
    );

    return successResponse(res, 'My orders retrieved successfully', ordersRes.rows);
  } catch (err) {
    console.error('[GET_MY_ORDERS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve orders.', 500);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = [];
    const values = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`o.status = $${paramIndex++}`);
      values.push(status.toUpperCase());
    }

    if (paymentStatus) {
      whereConditions.push(`o.payment_status = $${paramIndex++}`);
      values.push(paymentStatus.toUpperCase());
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countRes = await query(`SELECT COUNT(*) as total FROM orders o ${whereClause}`, values);
    const total = parseInt(countRes.rows[0].total, 10);
    const totalPages = Math.ceil(total / limitNum);

    const ordersQuery = `
      SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        c.brand as car_brand,
        c.model as car_model,
        (SELECT img.image_url FROM car_images img WHERE img.car_id = c.id ORDER BY img.is_primary DESC, img.display_order ASC LIMIT 1) as car_image
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN cars c ON o.car_id = c.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    values.push(limitNum, offset);

    const ordersRes = await query(ordersQuery, values);

    return successResponse(res, 'All orders retrieved successfully', ordersRes.rows, 200, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error('[GET_ALL_ORDERS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve orders.', 500);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const orderRes = await query(
      `SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        c.brand as car_brand,
        c.model as car_model,
        c.year as car_year,
        c.engine as car_engine,
        c.horsepower as car_horsepower,
        (SELECT img.image_url FROM car_images img WHERE img.car_id = c.id ORDER BY img.is_primary DESC, img.display_order ASC LIMIT 1) as car_image
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN cars c ON o.car_id = c.id
      WHERE o.id = $1`,
      [id]
    );

    if (orderRes.rows.length === 0) {
      return errorResponse(res, 'Order not found.', 404);
    }

    const order = orderRes.rows[0];

    if (!isAdmin && order.customer_id !== userId) {
      return errorResponse(res, 'Access denied. You cannot view another customer’s order.', 403);
    }

    return successResponse(res, 'Order details retrieved successfully', order);
  } catch (err) {
    console.error('[GET_ORDER_BY_ID ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve order.', 500);
  }
};

export const updateOrderStatus = async (req, res) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const { status, payment_status, deposit_paid, estimated_delivery, notes } = req.body;

    await client.query('BEGIN');

    const updateRes = await client.query(
      `UPDATE orders SET
        status = COALESCE($1, status),
        payment_status = COALESCE($2, payment_status),
        deposit_paid = COALESCE($3, deposit_paid),
        estimated_delivery = COALESCE($4, estimated_delivery),
        notes = COALESCE($5, notes),
        updated_at = NOW()
      WHERE id = $6
      RETURNING *`,
      [status, payment_status, deposit_paid ? Number(deposit_paid) : null, estimated_delivery, notes, id]
    );

    if (updateRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return errorResponse(res, 'Order not found.', 404);
    }

    const updatedOrder = updateRes.rows[0];

    // If order is COMPLETED, mark car as SOLD
    if (status === 'COMPLETED') {
      await client.query("UPDATE cars SET status = 'SOLD', updated_at = NOW() WHERE id = $1", [updatedOrder.car_id]);
    } else if (status === 'CANCELLED') {
      await client.query("UPDATE cars SET status = 'AVAILABLE', updated_at = NOW() WHERE id = $1", [updatedOrder.car_id]);
    }

    // Notify Customer
    await client.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, 'INFO')`,
      [
        updatedOrder.customer_id,
        `Order Update: #${updatedOrder.order_number}`,
        `Your vehicle acquisition order status has been updated to ${updatedOrder.status}.`
      ]
    );

    await client.query('COMMIT');

    return successResponse(res, 'Order status updated successfully', updatedOrder);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[UPDATE_ORDER_STATUS ERROR]:', err);
    return errorResponse(res, 'Failed to update order.', 500);
  } finally {
    client.release();
  }
};
