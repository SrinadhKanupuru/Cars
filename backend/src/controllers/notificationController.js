import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role?.toLowerCase();

    let notifsRes;
    if (userRole === 'admin') {
      // Admins see all admin/dealership notifications + user specific
      notifsRes = await query(
        `SELECT * FROM notifications WHERE user_id = $1 OR type IN ('BOOKING_REQUEST', 'ADMIN_ALERT') ORDER BY created_at DESC LIMIT 50`,
        [userId]
      );
    } else {
      notifsRes = await query(
        `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
        [userId]
      );
    }

    return successResponse(res, 'Notifications retrieved successfully', notifsRes.rows);
  } catch (err) {
    console.error('[GET_NOTIFICATIONS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve notifications.', 500);
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const updateRes = await query(
      `UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *`,
      [id]
    );

    if (updateRes.rows.length === 0) {
      return errorResponse(res, 'Notification not found.', 404);
    }

    return successResponse(res, 'Notification marked as read', updateRes.rows[0]);
  } catch (err) {
    console.error('[MARK_NOTIFICATION_READ ERROR]:', err);
    return errorResponse(res, 'Failed to update notification.', 500);
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;

    await query(
      `UPDATE notifications SET is_read = true WHERE user_id = $1 OR user_id IS NULL`,
      [userId]
    );

    return successResponse(res, 'All notifications marked as read', null);
  } catch (err) {
    console.error('[MARK_ALL_NOTIFICATIONS_READ ERROR]:', err);
    return errorResponse(res, 'Failed to update notifications.', 500);
  }
};
