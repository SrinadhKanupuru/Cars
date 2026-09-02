import { query, getClient } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getCars = async (req, res) => {
  try {
    const {
      brand,
      minPrice,
      maxPrice,
      year,
      minHorsepower,
      transmission,
      status,
      search,
      sortBy = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = [];
    const values = [];
    let paramIndex = 1;

    // Filters
    if (brand) {
      whereConditions.push(`LOWER(c.brand) = LOWER($${paramIndex++})`);
      values.push(brand);
    }

    if (minPrice) {
      whereConditions.push(`c.price >= $${paramIndex++}`);
      values.push(Number(minPrice));
    }

    if (maxPrice) {
      whereConditions.push(`c.price <= $${paramIndex++}`);
      values.push(Number(maxPrice));
    }

    if (year) {
      whereConditions.push(`c.year = $${paramIndex++}`);
      values.push(parseInt(year, 10));
    }

    if (minHorsepower) {
      whereConditions.push(`c.horsepower >= $${paramIndex++}`);
      values.push(parseInt(minHorsepower, 10));
    }

    if (transmission) {
      whereConditions.push(`LOWER(c.transmission) LIKE LOWER($${paramIndex++})`);
      values.push(`%${transmission}%`);
    }

    if (status) {
      whereConditions.push(`c.status = $${paramIndex++}`);
      values.push(status.toUpperCase());
    }

    if (search) {
      whereConditions.push(
        `(LOWER(c.model) LIKE LOWER($${paramIndex}) OR LOWER(c.brand) LIKE LOWER($${paramIndex}) OR LOWER(c.engine) LIKE LOWER($${paramIndex}) OR LOWER(c.vin) LIKE LOWER($${paramIndex}))`
      );
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Sorting
    let orderByClause = 'ORDER BY c.created_at DESC';
    switch (sortBy) {
      case 'price_asc':
        orderByClause = 'ORDER BY c.price ASC';
        break;
      case 'price_desc':
        orderByClause = 'ORDER BY c.price DESC';
        break;
      case 'newest':
        orderByClause = 'ORDER BY c.year DESC, c.created_at DESC';
        break;
      case 'oldest':
        orderByClause = 'ORDER BY c.year ASC, c.created_at ASC';
        break;
      case 'horsepower':
        orderByClause = 'ORDER BY c.horsepower DESC';
        break;
      default:
        orderByClause = 'ORDER BY c.created_at DESC';
    }

    // Total Count Query
    const countQuery = `SELECT COUNT(*) as total FROM cars c ${whereClause}`;
    const countRes = await query(countQuery, values);
    const total = parseInt(countRes.rows[0].total, 10);
    const totalPages = Math.ceil(total / limitNum);

    // Data Query with aggregated images and features
    const dataQuery = `
      SELECT 
        c.*,
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
      FROM cars c
      ${whereClause}
      ${orderByClause}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    values.push(limitNum, offset);

    const carsRes = await query(dataQuery, values);

    return successResponse(res, 'Cars retrieved successfully', carsRes.rows, 200, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error('[GET_CARS ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve cars.', 500);
  }
};

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    const carRes = await query(
      `SELECT 
        c.*,
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'id', img.id,
              'image_url', img.image_url,
              'is_primary', img.is_primary,
              'display_order', img.display_order
            ) ORDER BY img.is_primary DESC, img.display_order ASC
          ) FROM car_images img WHERE img.car_id = c.id),
          '[]'::json
        ) as image_details,
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
      FROM cars c
      WHERE c.id = $1`,
      [id]
    );

    if (carRes.rows.length === 0) {
      return errorResponse(res, 'Car not found with the specified ID.', 404);
    }

    return successResponse(res, 'Car details retrieved successfully', carRes.rows[0]);
  } catch (err) {
    console.error('[GET_CAR_BY_ID ERROR]:', err);
    return errorResponse(res, 'Failed to retrieve car details.', 500);
  }
};

export const createCar = async (req, res) => {
  const client = await getClient();
  try {
    const {
      id,
      brand,
      model,
      tagline,
      year,
      price,
      mileage,
      horsepower,
      engine,
      transmission,
      drivetrain,
      fuel_type,
      zero_to_hundred,
      top_speed,
      torque,
      body_type,
      exterior_color,
      interior_color,
      vin,
      description,
      status = 'AVAILABLE',
      is_featured = false,
      is_new_arrival = false,
      images = [],
      features = []
    } = req.body;

    const carId = (id || `${brand}-${model}-${year}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check duplicate ID or VIN
    const existing = await client.query(
      'SELECT id FROM cars WHERE id = $1 OR vin = $2',
      [carId, vin]
    );
    if (existing.rows.length > 0) {
      return errorResponse(res, 'A car with this ID or VIN already exists.', 409);
    }

    await client.query('BEGIN');

    const insertCarSql = `
      INSERT INTO cars (
        id, brand, model, tagline, year, price, mileage, horsepower, engine, transmission,
        drivetrain, fuel_type, zero_to_hundred, top_speed, torque, body_type, exterior_color,
        interior_color, vin, description, status, is_featured, is_new_arrival
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23
      ) RETURNING *
    `;

    const carRes = await client.query(insertCarSql, [
      carId, brand, model, tagline || null, parseInt(year, 10), Number(price), mileage || null,
      parseInt(horsepower, 10), engine, transmission, drivetrain || null, fuel_type || null,
      zero_to_hundred || null, top_speed || null, torque || null, body_type || 'Coupe',
      exterior_color || null, interior_color || null, vin, description || null,
      status, Boolean(is_featured), Boolean(is_new_arrival)
    ]);

    // Insert Images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === 'string' ? images[i] : images[i].image_url;
        const isPrimary = i === 0;
        await client.query(
          'INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES ($1, $2, $3, $4)',
          [carId, imgUrl, isPrimary, i + 1]
        );
      }
    }

    // Insert Features
    if (Array.isArray(features) && features.length > 0) {
      for (const feat of features) {
        await client.query(
          'INSERT INTO car_features (car_id, feature_name) VALUES ($1, $2)',
          [carId, typeof feat === 'string' ? feat : feat.feature_name]
        );
      }
    }

    await client.query('COMMIT');

    return successResponse(res, 'Car created successfully', carRes.rows[0], 201);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[CREATE_CAR ERROR]:', err);
    return errorResponse(res, 'Failed to create car.', 500);
  } finally {
    client.release();
  }
};

export const updateCar = async (req, res) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const {
      brand,
      model,
      tagline,
      year,
      price,
      mileage,
      horsepower,
      engine,
      transmission,
      drivetrain,
      fuel_type,
      zero_to_hundred,
      top_speed,
      torque,
      body_type,
      exterior_color,
      interior_color,
      vin,
      description,
      status,
      is_featured,
      is_new_arrival,
      images,
      features
    } = req.body;

    const existing = await client.query('SELECT * FROM cars WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return errorResponse(res, 'Car not found.', 404);
    }

    await client.query('BEGIN');

    const updateSql = `
      UPDATE cars SET
        brand = COALESCE($1, brand),
        model = COALESCE($2, model),
        tagline = COALESCE($3, tagline),
        year = COALESCE($4, year),
        price = COALESCE($5, price),
        mileage = COALESCE($6, mileage),
        horsepower = COALESCE($7, horsepower),
        engine = COALESCE($8, engine),
        transmission = COALESCE($9, transmission),
        drivetrain = COALESCE($10, drivetrain),
        fuel_type = COALESCE($11, fuel_type),
        zero_to_hundred = COALESCE($12, zero_to_hundred),
        top_speed = COALESCE($13, top_speed),
        torque = COALESCE($14, torque),
        body_type = COALESCE($15, body_type),
        exterior_color = COALESCE($16, exterior_color),
        interior_color = COALESCE($17, interior_color),
        vin = COALESCE($18, vin),
        description = COALESCE($19, description),
        status = COALESCE($20, status),
        is_featured = COALESCE($21, is_featured),
        is_new_arrival = COALESCE($22, is_new_arrival),
        updated_at = NOW()
      WHERE id = $23
      RETURNING *
    `;

    const updatedRes = await client.query(updateSql, [
      brand, model, tagline, year ? parseInt(year, 10) : null, price ? Number(price) : null,
      mileage, horsepower ? parseInt(horsepower, 10) : null, engine, transmission,
      drivetrain, fuel_type, zero_to_hundred, top_speed, torque, body_type,
      exterior_color, interior_color, vin, description, status,
      is_featured !== undefined ? Boolean(is_featured) : null,
      is_new_arrival !== undefined ? Boolean(is_new_arrival) : null,
      id
    ]);

    // Optional image updates if passed
    if (Array.isArray(images)) {
      await client.query('DELETE FROM car_images WHERE car_id = $1', [id]);
      for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === 'string' ? images[i] : images[i].image_url;
        await client.query(
          'INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES ($1, $2, $3, $4)',
          [id, imgUrl, i === 0, i + 1]
        );
      }
    }

    // Optional feature updates if passed
    if (Array.isArray(features)) {
      await client.query('DELETE FROM car_features WHERE car_id = $1', [id]);
      for (const feat of features) {
        await client.query(
          'INSERT INTO car_features (car_id, feature_name) VALUES ($1, $2)',
          [id, typeof feat === 'string' ? feat : feat.feature_name]
        );
      }
    }

    await client.query('COMMIT');

    return successResponse(res, 'Car updated successfully', updatedRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[UPDATE_CAR ERROR]:', err);
    return errorResponse(res, 'Failed to update car.', 500);
  } finally {
    client.release();
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteRes = await query('DELETE FROM cars WHERE id = $1 RETURNING id', [id]);

    if (deleteRes.rows.length === 0) {
      return errorResponse(res, 'Car not found.', 404);
    }

    return successResponse(res, 'Car deleted successfully from showroom inventory.');
  } catch (err) {
    console.error('[DELETE_CAR ERROR]:', err);
    return errorResponse(res, 'Failed to delete car.', 500);
  }
};
