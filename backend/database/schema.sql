-- =========================================================================
-- SPEEDX MOTORS - Database Schema
-- Relational PostgreSQL Schema for Luxury Sports Car Dealership System
-- =========================================================================

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS service_bookings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS test_drives CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS car_features CASCADE;
DROP TABLE IF EXISTS car_images CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 1. Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    phone VARCHAR(50),
    avatar TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Cars
CREATE TABLE cars (
    id VARCHAR(100) PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(150) NOT NULL,
    tagline TEXT,
    year INT NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    mileage VARCHAR(50),
    horsepower INT NOT NULL,
    engine VARCHAR(255) NOT NULL,
    transmission VARCHAR(100) NOT NULL,
    drivetrain VARCHAR(100),
    fuel_type VARCHAR(50),
    zero_to_hundred VARCHAR(20),
    top_speed VARCHAR(50),
    torque VARCHAR(50),
    body_type VARCHAR(50),
    exterior_color VARCHAR(100),
    interior_color VARCHAR(100),
    vin VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'SOLD')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Car Images
CREATE TABLE car_images (
    id SERIAL PRIMARY KEY,
    car_id VARCHAR(100) NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Car Features
CREATE TABLE car_features (
    id SERIAL PRIMARY KEY,
    car_id VARCHAR(100) NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    feature_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Wishlists
CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Wishlist Items
CREATE TABLE wishlist_items (
    id SERIAL PRIMARY KEY,
    wishlist_id INT NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
    car_id VARCHAR(100) NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (wishlist_id, car_id)
);

-- 8. Customers
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    membership_tier VARCHAR(50) DEFAULT 'Gold Apex Collector',
    total_purchases INT DEFAULT 0,
    total_spent NUMERIC(15, 2) DEFAULT 0,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    preferred_brands TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Leads
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE SET NULL,
    car_id VARCHAR(100) REFERENCES cars(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    source VARCHAR(50) DEFAULT 'Website VIP Form',
    budget NUMERIC(15, 2),
    priority VARCHAR(20) DEFAULT 'High',
    status VARCHAR(30) DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST')),
    assigned_to VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Test Drives
CREATE TABLE test_drives (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id VARCHAR(100) NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    location VARCHAR(200) DEFAULT 'Beverly Hills Private Circuit',
    instructor VARCHAR(100) DEFAULT 'Jean-Pierre Laurent (Master Instructor)',
    message TEXT,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id VARCHAR(100) NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    vin VARCHAR(50),
    amount NUMERIC(15, 2) NOT NULL,
    deposit_paid NUMERIC(15, 2) DEFAULT 0,
    delivery_address TEXT,
    estimated_delivery DATE,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED')),
    payment_status VARCHAR(30) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PARTIALLY_PAID', 'PAID', 'REFUNDED')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    transaction_reference VARCHAR(100) UNIQUE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Dealership Services
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    short_desc TEXT,
    full_desc TEXT,
    price_range VARCHAR(100),
    timeline VARCHAR(100),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Service Bookings
CREATE TABLE service_bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    car_model VARCHAR(150) NOT NULL,
    scheduled_date DATE NOT NULL,
    bay_number VARCHAR(50),
    technician VARCHAR(100),
    notes TEXT,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Car Rental Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_code VARCHAR(50) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    car_id VARCHAR(100) NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled')),
    rejection_reason TEXT,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id INT REFERENCES bookings(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for High Performance Queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_horsepower ON cars(horsepower);
CREATE INDEX idx_car_images_car_id ON car_images(car_id);
CREATE INDEX idx_car_features_car_id ON car_features(car_id);
CREATE INDEX idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_test_drives_customer_id ON test_drives(customer_id);
CREATE INDEX idx_test_drives_status ON test_drives(status);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_service_bookings_status ON service_bookings(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id, is_read);
