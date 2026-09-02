import { query, getClient } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistRes = await query(
      `SELECT 
        c.*,
        wi.created_at as saved_at,
        COALESCE(
          (SELECT json_agg(img.image_url ORDER BY img.is_primary DESC, img.display_order ASC)
           FROM car_images img WHERE img.car_id = c.id),
          '[]'::json
        ) as images,
        COALESCE(
          (SELECT json_agg(feat.feature_name)
           FROM car_features feat WHERE feat.car_id = c.id),
          '[]'::json
        ) as features
      FROM wishlist_items wi
      JOIN wishlists w ON wi.wishlist_id = w.id
      JOIN cars c ON wi.car_id = c.id
      WHERE w.user_id = $1
      ORDER BY wi.created_at DESC`,
      [userId]
    );

    return successResponse(res, 'Wishlist retrieved successfully', wishlistRes.rows);
  } catch (err) {
    console.error('[GET_WISHLIST ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve wishlist.', 500);
  }
};

export const addToWishlist = async (req, res) => {
  const client = await getClient();
  try {
    const userId = req.user.id;
    const { carId } = req.params;

    // Check car exists
    const carCheck = await client.query('SELECT id, model FROM cars WHERE id = $1', [carId]);
    if (carCheck.rows.length === 0) {
      return errorResponse(res, 'Car not found.', 404);
    }

    await client.query('BEGIN');

    // Ensure wishlist exists for user
    let wishlistRes = await client.query('SELECT id FROM wishlists WHERE user_id = $1', [userId]);
    let wishlistId;

    if (wishlistRes.rows.length === 0) {
      const newWishlist = await client.query(
        'INSERT INTO wishlists (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
      wishlistId = newWishlist.rows[0].id;
    } else {
      wishlistId = wishlistRes.rows[0].id;
    }

    // Insert wishlist item (ignore duplicate)
    const insertRes = await client.query(
      `INSERT INTO wishlist_items (wishlist_id, car_id)
       VALUES ($1, $2)
       ON CONFLICT (wishlist_id, car_id) DO NOTHING
       RETURNING id`,
      [wishlistId, carId]
    );

    await client.query('COMMIT');

    const isNew = insertRes.rows.length > 0;
    return successResponse(
      res,
      isNew ? 'Car added to wishlist' : 'Car is already in your wishlist',
      { carId, isNew },
      isNew ? 201 : 200
    );
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[ADD_WISHLIST ERROR]:', err);
    return errorResponse(res, 'Failed to add car to wishlist.', 500);
  } finally {
    client.release();
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId } = req.params;

    const deleteRes = await query(
      `DELETE FROM wishlist_items wi
       USING wishlists w
       WHERE wi.wishlist_id = w.id AND w.user_id = $1 AND wi.car_id = $2
       RETURNING wi.id`,
      [userId, carId]
    );

    if (deleteRes.rows.length === 0) {
      return errorResponse(res, 'Car was not in your wishlist.', 404);
    }

    return successResponse(res, 'Car removed from wishlist', { carId });
  } catch (err) {
    console.error('[REMOVE_WISHLIST ERROR]:', err);
    return errorResponse(res, 'Failed to remove car from wishlist.', 500);
  }
};
