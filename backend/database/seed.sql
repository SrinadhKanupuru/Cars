-- =========================================================================
-- SPEEDX MOTORS - Seed Dataset (Demo & Development Data)
-- Realistic collector-grade hypercars, roles, users, and transactions
-- =========================================================================

-- 1. Roles
INSERT INTO roles (id, name, description) VALUES 
(1, 'ADMIN', 'Dealership Management & Principal Admin with full system access'),
(2, 'CUSTOMER', 'VIP Client & Private Collector Portal access')
ON CONFLICT (id) DO NOTHING;

-- 2. Users (Password: 'password123' -> $2a$10$EqnEqRTIt60riHTrIHSwXOpkkvFyKE1v8jppbmp7ORgD.xlKehTrG)
INSERT INTO users (id, name, email, password_hash, role_id, phone, status, avatar) VALUES
(1, 'Sebastian Vance', 'admin@speedxmotors.com', '$2a$10$EqnEqRTIt60riHTrIHSwXOpkkvFyKE1v8jppbmp7ORgD.xlKehTrG', 1, '+1 (800) 773-3390', 'ACTIVE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
(2, 'Lord Julian Beaumont', 'customer@speedxmotors.com', '$2a$10$EqnEqRTIt60riHTrIHSwXOpkkvFyKE1v8jppbmp7ORgD.xlKehTrG', 2, '+44 20 7946 0912', 'ACTIVE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
(3, 'Elena Rostova', 'elena.rostova@monacowealth.mc', '$2a$10$EqnEqRTIt60riHTrIHSwXOpkkvFyKE1v8jppbmp7ORgD.xlKehTrG', 2, '+377 98 98 00 11', 'ACTIVE', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'),
(4, 'Kaito Takahashi', 'takahashi@tokyofinance.jp', '$2a$10$EqnEqRTIt60riHTrIHSwXOpkkvFyKE1v8jppbmp7ORgD.xlKehTrG', 2, '+81 3 5555 0192', 'ACTIVE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'),
(5, 'Marcus Sterling', 'marcus.sterling@sterlingcorp.ch', '$2a$10$EqnEqRTIt60riHTrIHSwXOpkkvFyKE1v8jppbmp7ORgD.xlKehTrG', 2, '+41 22 819 9000', 'ACTIVE', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for users
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 3. Customers Profile Metadata
INSERT INTO customers (user_id, membership_tier, total_purchases, total_spent, address, city, country, preferred_brands, notes) VALUES
(2, 'Black Diamond VIP Apex', 3, 2950000.00, '14 Belgrave Square', 'London', 'United Kingdom', 'Ferrari, Porsche, Koenigsegg', 'Prefers private runway delivery and single-car covered transporter.'),
(3, 'Founding Syndicate Member', 2, 4800000.00, 'Avenue Princesse Grace 24', 'Monaco', 'Monaco', 'Bugatti, Pagani, Ferrari', 'Immediate wire escrow settlement standard.'),
(4, 'Black Centurion VIP', 4, 6200000.00, 'Minato-ku Roppongi Hills', 'Tokyo', 'Japan', 'Porsche, McLaren, Nissan GT-R', 'Collects ultra-rare track special allocations.'),
(5, 'Apex Collector', 1, 625000.00, 'Rue du Rhône 42', 'Geneva', 'Switzerland', 'Ferrari, Aston Martin', 'Interested in hybrid hypercar powertrain evolutions.')
ON CONFLICT (user_id) DO NOTHING;

-- 4. Wishlists
INSERT INTO wishlists (user_id) VALUES (2), (3), (4), (5)
ON CONFLICT (user_id) DO NOTHING;

-- 5. Cars Inventory
INSERT INTO cars (
    id, brand, model, tagline, year, price, mileage, horsepower, engine, transmission,
    drivetrain, fuel_type, zero_to_hundred, top_speed, torque, body_type, exterior_color,
    interior_color, vin, description, status, is_featured, is_new_arrival, rating
) VALUES
(
    '488-pista', 'Ferrari', '488 Pista', 'Track-Honed Special Series V8 Mastery',
    2024, 495000.00, '950 km', 710, '3.9L Twin-Turbocharged V8', '7-Speed F1 Dual-Clutch',
    'Rear-Wheel Drive', 'Petrol', '2.85s', '340 km/h', '770 Nm', 'Coupe',
    'Rosso Corsa with NART Blu Racing Stripe', 'Nero Alcantara with Rosso Stitching',
    'ZFF84ALA0K0239102', 'The Ferrari 488 Pista is Maranello’s track-bred masterpiece. Powered by the award-winning 3.9-liter twin-turbo V8 producing 710 hp, with Formula 1-derived S-Duct aerodynamics and lightning-fast shifts.',
    'AVAILABLE', true, false, 4.98
),
(
    'huracan-evo', 'Lamborghini', 'Huracán EVO', 'Atmospheric V10 Opera & LDVI Vehicle Dynamics',
    2024, 325000.00, '1,400 km', 631, '5.2L Naturally Aspirated V10', '7-Speed Dual-Clutch LDF',
    'All-Wheel Drive', 'Petrol', '2.9s', '325 km/h', '600 Nm', 'Coupe',
    'Arancio Xanto (Metallic Orange)', 'Sportivo Leather in Nero Ade & Arancio',
    'ZHWUE4ZF4LA019842', 'The Lamborghini Huracán EVO combines the spine-tingling acoustic roar of a naturally aspirated 5.2L V10 with predictive LDVI chassis control and rear-wheel steering for razor-sharp handling.',
    'AVAILABLE', true, true, 4.94
),
(
    'mclaren-720s', 'McLaren', '720S Performance', 'Relentless Velocity and Carbon MonoCage II Supremacy',
    2023, 345000.00, '2,800 km', 710, '4.0L Twin-Turbocharged M840T V8', '7-Speed Seamless Shift Gearbox (SSG)',
    'Rear-Wheel Drive', 'Petrol', '2.8s', '341 km/h', '770 Nm', 'Coupe',
    'Papaya Spark with Exposed Carbon Aero', 'Carbon Black Alcantara & Scoria Grey',
    'SBM14RAB7JW002914', 'The McLaren 720S revolutionized supercar performance metrics. Featuring dihedral doors, a bespoke ultra-rigid carbon monocoque, and unmatched mid-range hypercar acceleration.',
    'AVAILABLE', true, false, 4.92
),
(
    '911-turbo-s', 'Porsche', '911 Turbo S (992)', 'The Benchmark of All-Weather Supercar Acceleration',
    2024, 289000.00, '1,100 km', 640, '3.7L Twin-Turbocharged Boxer 6', '8-Speed Porsche Doppelkupplung (PDK)',
    'All-Wheel Drive (PTM)', 'Petrol', '2.6s', '330 km/h', '800 Nm', 'Coupe',
    'GT Silver Metallic with Gloss Carbon Roof', 'Two-Tone Black & Bordeaux Red Exclusive Leather',
    'WP0AD2A99PS189021', 'The 992-generation Porsche 911 Turbo S is the undisputed king of cross-country grand touring speed. Launching from 0 to 100 km/h in 2.6 seconds with monumental stability and everyday refinement.',
    'AVAILABLE', true, true, 4.97
),
(
    'sf90-stradale', 'Ferrari', 'SF90 Stradale Assetto Fiorano', 'The Pinnacle of Hybrid Maranello Engineering',
    2024, 625000.00, '1,200 km', 986, '4.0L Twin-Turbo V8 + 3 Electric Motors', '8-Speed Dual-Clutch F1',
    'All-Wheel Drive (e-AWD)', 'Plug-in Hybrid', '2.5s', '340 km/h', '800 Nm', 'Coupe',
    'Rosso Corsa with Giallo Modena Accents', 'Nero Leather with Giallo Stitching',
    'ZFF90LA45N0289142', 'The Ferrari SF90 Stradale represents a paradigm shift in hypercar performance. Combining a devastating 4.0-liter twin-turbocharged V8 with three cutting-edge electric motors, it delivers an astounding 986 hp to all four wheels.',
    'RESERVED', false, true, 4.95
),
(
    '911-gt3-rs', 'Porsche', '911 GT3 RS (992)', 'Motorsport Aerodynamics for the Road',
    2024, 385000.00, '850 km', 518, '4.0L Naturally Aspirated Flat-6', '7-Speed Porsche Doppelkupplung (PDK)',
    'Rear-Wheel Drive', 'Petrol (High Octane 98)', '3.2s', '296 km/h', '465 Nm', 'Coupe',
    'Ice Grey Metallic with Pyro Red Decals', 'Weissach Race-Tex with Guards Red Accents',
    'WP0AF2A97RS198422', 'The 992-generation Porsche 911 GT3 RS is the ultimate apex predator for both closed circuit and canyon carving. With its DRS-equipped active wing generating over 860 kg of downforce at speed.',
    'AVAILABLE', false, true, 5.00
),
(
    'revuelto-v12', 'Lamborghini', 'Revuelto V12 HPEV', 'The First Super Sports V12 Hybrid',
    2024, 745000.00, '350 km', 1001, '6.5L Naturally Aspirated V12 + 3 E-Motors', '8-Speed Dual-Clutch Transverse',
    'All-Wheel Drive (Torque Vectoring)', 'Plug-in Hybrid', '2.5s', '350 km/h', '725 Nm + 350 Nm E-Boost', 'Coupe',
    'Giallo Inti (Pearl Yellow)', 'Nero Ade / Arancio Leonis Sportivo Leather',
    'ZHWRE6ZB8RL009218', 'SantAgata Bologneses crowning achievement: the Lamborghini Revuelto. Melding an operatic, high-revving 6.5-liter atmospheric V12 with three electric motors generating quadruple-digit horsepower.',
    'AVAILABLE', false, true, 4.98
),
(
    'mclaren-750s-spider', 'McLaren', '750S Spider', 'Pure Performance in Open-Air Grandeur',
    2024, 415000.00, '1,500 km', 740, '4.0L Twin-Turbocharged M840T V8', '7-Speed Seamless Shift Gearbox (SSG)',
    'Rear-Wheel Drive', 'Petrol', '2.8s', '332 km/h', '800 Nm', 'Convertible / Spider',
    'Papaya Spark', 'Carbon Black Alcantara with Orange Piping',
    'SBM14RAB7NW001923', 'The McLaren 750S Spider is the lightest, most agile series-production supercar from Woking. Boasting 30 hp more and 30 kg less weight than its predecessor.',
    'AVAILABLE', false, false, 4.90
),
(
    'aston-martin-dbs-770', 'Aston Martin', 'DBS 770 Ultimate', 'The Ferocious Swan Song of the Twin-Turbo V12',
    2023, 460000.00, '2,100 km', 759, '5.2L Twin-Turbo 48-Valve V12', 'ZF 8-Speed Automatic with Column Shift',
    'Rear-Wheel Drive', 'Petrol', '3.4s', '340 km/h', '900 Nm', 'Coupe',
    'Satin Titanium Grey with Crimson Pinstripe', 'Semi-Aniline Leather in Obsidian Black & Spicy Red',
    'SCFRMAW21PGL00431', 'Limited to just 300 coupes worldwide, the Aston Martin DBS 770 Ultimate is a collectors masterpiece. The most powerful production Aston Martin of its era.',
    'RESERVED', false, false, 4.93
),
(
    'bugatti-chiron-pur-sport', 'Bugatti', 'Chiron Pur Sport', 'Pure Agility and Quad-Turbo W16 Dominance',
    2023, 4300000.00, '620 km', 1479, '8.0L Quad-Turbocharged W16', '7-Speed Dual-Clutch Sequential',
    'Permanent All-Wheel Drive', 'Petrol (Ultra 100)', '2.3s', '350 km/h', '1,600 Nm', 'Coupe',
    'French Racing Blue with Exposed Carbon', 'Beluga Black Alcantara with Lake Blue Stitching',
    'VF9CC8738NM795011', 'The Bugatti Chiron Pur Sport is an engineering tour-de-force calibrated specifically for apex-carving agility and blistering lateral grip.',
    'SOLD', false, false, 5.00
),
(
    'koenigsegg-jesko-attack', 'Koenigsegg', 'Jesko Attack', 'Megacar Aerodynamic Supremacy',
    2024, 3950000.00, '180 km', 1600, '5.0L Twin-Turbo Flat-Plane V8 (E85 Fuel)', '9-Speed Light Speed Transmission (LST)',
    'Rear-Wheel Drive with Electronic Differential', 'FlexFuel (E85 / Premium 98)', '2.4s', '480 km/h (Theoretical)', '1,500 Nm', 'Coupe',
    'Crystal White Pearl with Ghost Carbon & Slime Green Livery', 'Desiato Alcantara with Green Diamond Stitching',
    'YT9K142A9NL001204', 'The Koenigsegg Jesko Attack represents the absolute zenith of hypercar capability. Featuring Christian von Koenigseggs revolutionary 9-speed Light Speed Transmission.',
    'AVAILABLE', false, true, 5.00
),
(
    'amg-gt-black-series', 'Mercedes-AMG', 'AMG GT Black Series', 'Nürburgring Record-Setting Thoroughbred',
    2023, 365000.00, '3,400 km', 720, '4.0L Biturbo Flat-Plane Crank V8', '7-Speed AMG SPEEDSHIFT DCT',
    'Rear-Wheel Drive', 'Petrol', '3.1s', '325 km/h', '800 Nm', 'Coupe',
    'AMG Magmabeam Orange', 'Exclusive Nappa Leather / DINAMICA with Orange Contrast',
    'WDD1903791A041920', 'The Mercedes-AMG GT Black Series is the most aggressive execution of the GT platform. Featuring a bespoke flat-plane crankshaft 4.0L biturbo V8 generating 720 horsepower.',
    'AVAILABLE', false, false, 4.88
),
(
    'bmw-m4-csl', 'BMW M', 'M4 CSL Edition', 'Competition, Sport, Lightweight',
    2023, 189000.00, '1,950 km', 543, '3.0L M TwinPower Turbo Inline-6', '8-Speed M Steptronic with Drivelogic',
    'Rear-Wheel Drive', 'Petrol', '3.6s', '307 km/h', '650 Nm', 'Coupe',
    'Frozen Brooklyn Grey Metallic with Red Accents', 'Full Carbon Bucket Seats in Anthracite Merino',
    'WBA43AZ08PFP89102', 'Re-igniting the legendary CSL designation for BMW Ms 50th anniversary. Stripped of 100 kg compared to the standard M4 Competition, packing 543 hp.',
    'AVAILABLE', false, false, 4.85
),
(
    'audi-r8-v10', 'Audi Sport', 'R8 V10 Performance Quattro', 'The Last Pure Atmospheric V10 Supercar',
    2023, 215000.00, '3,100 km', 602, '5.2L FSI Naturally Aspirated V10', '7-Speed S tronic Dual-Clutch',
    'Quattro Permanent All-Wheel Drive', 'Petrol', '3.1s', '331 km/h', '560 Nm', 'Coupe',
    'Kemora Grey Metallic with Carbon Sigma Blades', 'Fine Nappa Leather with Diamond Quilting in Express Red',
    'WAUZZZ4S5P7902114', 'The swansong of Audis glorious mid-engine supercar era. Featuring the high-revving 5.2-liter atmospheric V10 delivering razor-sharp throttle response and legendary Quattro grip.',
    'AVAILABLE', false, false, 4.91
),
(
    'nissan-gtr-nismo', 'Nissan GT-R', 'GT-R NISMO Special Edition', 'Takumi Hand-Built Twin-Turbo Godzilla',
    2024, 235000.00, '850 km', 600, '3.8L Twin-Turbo VR38DETT V6', '6-Speed Dual-Clutch Transaxle',
    'ATTESA E-TS All-Wheel Drive', 'Petrol', '2.7s', '330 km/h', '652 Nm', 'Coupe',
    'NISMO Stealth Grey with Clear-Coated Carbon Bonnet', 'Recaro Carbon-Backed Bucket Seats in Leather/Alcantara',
    'JN1GANAR4PU008129', 'Handcrafted in clean rooms in Yokohama by master Takumi craftsmen. Equipped with GT3 turbochargers, Brembo carbon ceramic brakes, and carbon composite body panels for supreme track dominance.',
    'AVAILABLE', false, true, 4.93
),
(
    'rolls-royce-phantom-viii', 'Rolls-Royce', 'Phantom VIII Extended', 'The Absolute Pinnacle of Bespoke Opulence',
    2024, 585000.00, '450 km', 563, '6.75L Twin-Turbocharged V12', '8-Speed Satellite Aided Automatic',
    'Rear-Wheel Drive', 'Petrol', '5.1s', '250 km/h', '900 Nm', 'Sedan',
    'Two-Tone Midnight Sapphire & Silver Frost', 'Seashell & Navy Blue Bespoke Leather with Piano Black Inlays',
    'SCA684S51PUX08192', 'The Rolls-Royce Phantom VIII Extended is the quintessential definition of luxury motoring. Handcrafted in Goodwood, England, featuring 130 kg of acoustic insulation, a 6.75L twin-turbo V12, and an iconic Starlight Headliner.',
    'AVAILABLE', true, true, 5.00
),
(
    'rolls-royce-spectre', 'Rolls-Royce', 'Spectre Ultra-Luxury Electric Coupe', 'An All-Electric Prophecy Fulfilled',
    2024, 420000.00, '820 km', 577, 'Dual Electric Motors (102 kWh Battery)', 'Single-Speed Planetary Reduction',
    'All-Wheel Drive', 'Electric', '4.4s', '250 km/h', '900 Nm', 'Coupe',
    'Black Diamond with Chartreuse Coachline', 'Grace White & Mandarin Leather with Starlight Doors',
    'SCA688D02RU004921', 'The Rolls-Royce Spectre is the marques first fully electric ultra-luxury super coupe. Delivering 577 hp of instantaneous, whisper-silent thrust with Starlight Doors and Planar magic carpet suspension.',
    'AVAILABLE', false, true, 4.97
)
ON CONFLICT (id) DO UPDATE SET
    brand = EXCLUDED.brand,
    model = EXCLUDED.model,
    tagline = EXCLUDED.tagline,
    year = EXCLUDED.year,
    price = EXCLUDED.price,
    mileage = EXCLUDED.mileage,
    horsepower = EXCLUDED.horsepower,
    engine = EXCLUDED.engine,
    transmission = EXCLUDED.transmission,
    drivetrain = EXCLUDED.drivetrain,
    fuel_type = EXCLUDED.fuel_type,
    zero_to_hundred = EXCLUDED.zero_to_hundred,
    top_speed = EXCLUDED.top_speed,
    torque = EXCLUDED.torque,
    body_type = EXCLUDED.body_type,
    exterior_color = EXCLUDED.exterior_color,
    interior_color = EXCLUDED.interior_color,
    vin = EXCLUDED.vin,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    is_featured = EXCLUDED.is_featured,
    is_new_arrival = EXCLUDED.is_new_arrival,
    rating = EXCLUDED.rating;

-- 6. Car Images (Curated, verified, accurate)
DELETE FROM car_images;
INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES
-- Ferrari 488 Pista
('488-pista', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80', true, 1),
('488-pista', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80', false, 2),
('488-pista', 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1600&q=80', false, 3),
('488-pista', 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Lamborghini Huracán EVO
('huracan-evo', 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80', true, 1),
('huracan-evo', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80', false, 2),
('huracan-evo', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80', false, 3),
('huracan-evo', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80', false, 4),

-- McLaren 720S Performance
('mclaren-720s', 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1600&q=80', true, 1),
('mclaren-720s', 'https://images.unsplash.com/photo-1563720223523-491ff04651de?auto=format&fit=crop&w=1600&q=80', false, 2),
('mclaren-720s', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=80', false, 3),
('mclaren-720s', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Porsche 911 Turbo S
('911-turbo-s', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80', true, 1),
('911-turbo-s', 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=80', false, 2),
('911-turbo-s', 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&w=1600&q=80', false, 3),
('911-turbo-s', 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Ferrari SF90 Stradale
('sf90-stradale', 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1600&q=80', true, 1),
('sf90-stradale', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80', false, 2),
('sf90-stradale', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80', false, 3),
('sf90-stradale', 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Porsche 911 GT3 RS
('911-gt3-rs', 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=1600&q=80', true, 1),
('911-gt3-rs', 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=80', false, 2),
('911-gt3-rs', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80', false, 3),
('911-gt3-rs', 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Lamborghini Revuelto V12
('revuelto-v12', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80', true, 1),
('revuelto-v12', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1600&q=80', false, 2),
('revuelto-v12', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80', false, 3),
('revuelto-v12', 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80', false, 4),

-- McLaren 750S Spider
('mclaren-750s-spider', 'https://images.unsplash.com/photo-1563720223523-491ff04651de?auto=format&fit=crop&w=1600&q=80', true, 1),
('mclaren-750s-spider', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=80', false, 2),
('mclaren-750s-spider', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80', false, 3),
('mclaren-750s-spider', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Aston Martin DBS 770
('aston-martin-dbs-770', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80', true, 1),
('aston-martin-dbs-770', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1600&q=80', false, 2),
('aston-martin-dbs-770', 'https://images.unsplash.com/photo-1563720223523-491ff04651de?auto=format&fit=crop&w=1600&q=80', false, 3),
('aston-martin-dbs-770', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Bugatti Chiron Pur Sport
('bugatti-chiron-pur-sport', 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&w=1600&q=80', true, 1),
('bugatti-chiron-pur-sport', 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80', false, 2),
('bugatti-chiron-pur-sport', 'https://images.unsplash.com/photo-1563720223523-491ff04651de?auto=format&fit=crop&w=1600&q=80', false, 3),
('bugatti-chiron-pur-sport', 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Koenigsegg Jesko Attack
('koenigsegg-jesko-attack', 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80', true, 1),
('koenigsegg-jesko-attack', 'https://images.unsplash.com/photo-1563720223523-491ff04651de?auto=format&fit=crop&w=1600&q=80', false, 2),
('koenigsegg-jesko-attack', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80', false, 3),
('koenigsegg-jesko-attack', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Mercedes-AMG GT Black Series
('amg-gt-black-series', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80', true, 1),
('amg-gt-black-series', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80', false, 2),
('amg-gt-black-series', 'https://images.unsplash.com/photo-1563720223523-491ff04651de?auto=format&fit=crop&w=1600&q=80', false, 3),
('amg-gt-black-series', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80', false, 4),

-- BMW M4 CSL Edition
('bmw-m4-csl', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80', true, 1),
('bmw-m4-csl', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80', false, 2),
('bmw-m4-csl', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80', false, 3),
('bmw-m4-csl', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Audi R8 V10 Performance
('audi-r8-v10', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1600&q=80', true, 1),
('audi-r8-v10', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=80', false, 2),
('audi-r8-v10', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1600&q=80', false, 3),
('audi-r8-v10', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Nissan GT-R NISMO Special Edition
('nissan-gtr-nismo', 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=80', true, 1),
('nissan-gtr-nismo', 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=80', false, 2),
('nissan-gtr-nismo', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80', false, 3),
('nissan-gtr-nismo', 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=80', false, 4),

-- Rolls-Royce Phantom VIII Extended
('rolls-royce-phantom-viii', 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80', true, 1),
('rolls-royce-phantom-viii', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80', false, 2),
('rolls-royce-phantom-viii', 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1600&q=80', false, 3),

-- Rolls-Royce Spectre Electric Coupe
('rolls-royce-spectre', 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1600&q=80', true, 1),
('rolls-royce-spectre', 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80', false, 2),
('rolls-royce-spectre', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80', false, 3)
ON CONFLICT DO NOTHING;

-- 7. Car Features
INSERT INTO car_features (car_id, feature_name) VALUES
('488-pista', 'Carbon Fiber Racing Seats'),
('488-pista', 'Titanium Exhaust System'),
('488-pista', 'S-Duct Front Aero Channel'),
('488-pista', 'Carbon Ceramic Brakes (CCM)'),
('huracan-evo', 'LDVI Vehicle Dynamics Controller'),
('huracan-evo', 'Rear-Wheel Steering'),
('huracan-evo', 'Magnetorheological Suspension'),
('mclaren-720s', 'MonoCage II Full Carbon Chassis'),
('mclaren-720s', 'Proactive Chassis Control II'),
('mclaren-720s', 'Active Airbrake Wing'),
('911-turbo-s', 'Porsche Ceramic Composite Brakes (PCCB)'),
('911-turbo-s', 'Front Axle Lift System'),
('911-turbo-s', 'Burmester High-End 3D Sound'),
('sf90-stradale', 'Assetto Fiorano Track Package'),
('sf90-stradale', 'Carbon Ceramic Brakes (CCM)'),
('sf90-stradale', 'Multimatic Racing Shock Absorbers'),
('911-gt3-rs', 'DRS Active Rear Aerodynamic Wing'),
('911-gt3-rs', 'Full Weissach Package with Carbon Cage'),
('revuelto-v12', 'Monofuselage Full Carbon Fiber Chassis'),
('revuelto-v12', 'Carbon Ceramic Brakes Plus (CCB Plus)'),
('bugatti-chiron-pur-sport', '1.90m Fixed Carbon Fiber Rear Wing'),
('bugatti-chiron-pur-sport', 'Magnesium Aerodynamic Wheels'),
('koenigsegg-jesko-attack', '9-Speed Light Speed Transmission (LST)'),
('koenigsegg-jesko-attack', 'Active Triplex Suspension System'),
('amg-gt-black-series', 'Two-Stage Adjustable Carbon Fiber Wing'),
('amg-gt-black-series', '9-Stage AMG Traction Control Rotary Switch'),
('bmw-m4-csl', 'Motorsport Yellow Laserlight Headlights'),
('bmw-m4-csl', 'M Carbon Full Bucket Racing Seats'),
('audi-r8-v10', 'Naturally Aspirated 5.2L V10 Engine'),
('audi-r8-v10', 'Quattro Permanent All-Wheel Drive'),
('nissan-gtr-nismo', 'Handcrafted Takumi VR38DETT Engine'),
('nissan-gtr-nismo', 'Brembo Carbon Ceramic Brake System'),
('rolls-royce-phantom-viii', 'Shooting Star Starlight Headliner'),
('rolls-royce-phantom-viii', 'Bespoke 18-Speaker Audio System'),
('rolls-royce-phantom-viii', 'Integrated Champagne Cooler & Crystal Flutes'),
('rolls-royce-phantom-viii', 'Power-Closing Coach Rear Doors'),
('rolls-royce-spectre', '4,796 Illuminated Fibre-Optic Stars'),
('rolls-royce-spectre', 'Planar Suspension System with Anti-Roll Decoupling'),
('rolls-royce-spectre', 'Illuminated Pantheon Grille with 22 LEDs'),
('rolls-royce-spectre', 'Rolls-Royce Bespoke Audio 1400W')
ON CONFLICT DO NOTHING;

-- 8. Wishlist Items
INSERT INTO wishlist_items (wishlist_id, car_id) VALUES
(1, '488-pista'),
(1, '911-turbo-s'),
(2, 'bugatti-chiron-pur-sport')
ON CONFLICT DO NOTHING;

-- 9. Leads
INSERT INTO leads (customer_id, car_id, name, email, phone, message, source, budget, priority, status, assigned_to) VALUES
(2, '488-pista', 'Lord Julian Beaumont', 'customer@speedxmotors.com', '+44 20 7946 0912', 'Interested in scheduling a private runway trial session for the Ferrari 488 Pista.', 'VIP Concierge Hotline', 550000.00, 'Urgent', 'QUALIFIED', 'Sebastian Vance'),
(3, 'sf90-stradale', 'Elena Rostova', 'elena.rostova@monacowealth.mc', '+377 98 98 00 11', 'Requesting full telemetry inspection report and export logistics quote to Port Hercule, Monaco.', 'Private Invitation', 700000.00, 'High', 'CONTACTED', 'Sebastian Vance'),
(4, '911-turbo-s', 'Kaito Takahashi', 'takahashi@tokyofinance.jp', '+81 3 5555 0192', 'Looking for immediate allocation with Weissach or lightweight package options.', 'Website VIP Form', 350000.00, 'Medium', 'NEW', 'Sales Concierge')
ON CONFLICT DO NOTHING;

-- 10. Test Drives
INSERT INTO test_drives (customer_id, car_id, preferred_date, preferred_time, location, instructor, message, status) VALUES
(2, '488-pista', CURRENT_DATE + INTERVAL '3 days', '10:00 AM - 12:00 PM', 'Private Airport Runway (Runway 24L)', 'Jean-Pierre Laurent (Master Instructor)', 'Full high-speed telemetry logging requested.', 'CONFIRMED'),
(2, '911-turbo-s', CURRENT_DATE + INTERVAL '7 days', '02:00 PM - 04:00 PM', 'Thermal Club Motorsport Circuit', 'Jean-Pierre Laurent (Master Instructor)', 'Chassis dynamic comparison trial.', 'PENDING')
ON CONFLICT DO NOTHING;

-- 11. Orders
INSERT INTO orders (id, order_number, customer_id, car_id, vin, amount, deposit_paid, delivery_address, estimated_delivery, status, payment_status, notes) VALUES
(1, 'ORD-2026-9041', 2, '488-pista', 'ZFF84ALA0K0239102', 495000.00, 100000.00, '14 Belgrave Square, London, SW1X 8PZ, United Kingdom', CURRENT_DATE + INTERVAL '14 days', 'PROCESSING', 'PARTIALLY_PAID', 'Enclosed single-car air freight to London Stansted.'),
(2, 'ORD-2026-8912', 3, 'bugatti-chiron-pur-sport', 'VF9CC8738NM795011', 4300000.00, 4300000.00, 'Avenue Princesse Grace 24, 98000 Monaco', CURRENT_DATE - INTERVAL '10 days', 'COMPLETED', 'PAID', 'Full Swiss bank escrow wire completed.')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for orders
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));

-- 12. Payments
INSERT INTO payments (order_id, customer_id, amount, payment_method, status, transaction_reference, notes) VALUES
(1, 2, 100000.00, 'Bank Wire Escrow', 'PAID', 'WIRE-SX-2026-0982', 'Initial 20% commitment deposit held in secure dealership escrow.'),
(2, 3, 4300000.00, 'Crypto USDC Escrow', 'PAID', 'CRYPTO-TX-0x89FA911B', 'Full multi-signature crypto escrow settlement verified on ledger.')
ON CONFLICT DO NOTHING;

-- 13. Dealership Services
INSERT INTO services (id, title, category, short_desc, full_desc, price_range, timeline, icon, is_active) VALUES
(1, 'White-Glove Global Logistics', 'Logistics', 'Climate-controlled enclosed transport and private air freight to any estate or yacht globally.', 'Hermetically sealed, temperature-regulated transport pods with GPS satellite tracking and $25M transit insurance policy coverage.', '$5,000 - $35,000', '2 - 7 Business Days', 'Truck', true),
(2, 'Track-Side Telemetry & Support', 'Motorsport', 'Dedicated pit crew, telemetry engineers, and tire support for your private circuit days.', 'Comprehensive pit crew deployment including master telemetry data engineers, tire warmers, race fuel management, and real-time video telemetry analysis.', '$8,500 / Day', 'On Demand', 'Gauge', true),
(3, 'Bespoke Performance Engineering', 'Tuning & Dynamics', 'Factory-certified power upgrades, bespoke exhaust fabrication, and suspension optimization.', 'Bespoke titanium exhaust design, ECU recalibration on AWD dyno cell, suspension geometry setup, and carbon composite aero tuning.', '$12,000 - $85,000', '1 - 3 Weeks', 'Zap', true),
(4, 'Ceramic Armor & Self-Healing PPF', 'Aesthetics', 'Clean-room 10-mil self-healing Paint Protection Film and 9H dual-layer ceramic shielding.', 'Complete disassembly and full-body edge-wrapped 10-mil polyurethane film application inside our ISO-certified clean-room bay.', '$6,500 - $14,000', '3 - 5 Days', 'ShieldCheck', true),
(5, 'Discreet International Escrow', 'Finance & Advisory', 'Multi-jurisdiction wealth structuring, tax-optimized leasing, and instant crypto settlement.', 'Discreet acquisition support through Swiss, Monaco, and Delaware escrow accounts with multi-currency and crypto settlement pipelines.', '0.5% - 1.0% Escrow', 'Instant / Same-Day', 'Award', true),
(6, 'Factory Certification & Maintenance', 'Mechanical Audit', '250-point factory audit, fluid spectrometer testing, and telemetry health diagnostic.', 'Comprehensive mechanical audit performed exclusively by certified Master Technicians with genuine OEM telemetry tools.', '$3,500 - $9,500', '1 - 2 Days', 'FileCheck', true)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for services
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));

-- 14. Service Bookings
INSERT INTO service_bookings (user_id, service_id, customer_name, customer_email, customer_phone, car_model, scheduled_date, bay_number, technician, notes, status) VALUES
(2, 4, 'Lord Julian Beaumont', 'customer@speedxmotors.com', '+44 20 7946 0912', 'Ferrari 488 Pista', CURRENT_DATE + INTERVAL '5 days', 'Bay 1 (Clean Room)', 'Marco Rossi (Master Detailer)', 'Full self-healing PPF wrap requested before delivery.', 'CONFIRMED'),
(4, 3, 'Kaito Takahashi', 'takahashi@tokyofinance.jp', '+81 3 5555 0192', 'Porsche 911 Turbo S', CURRENT_DATE + INTERVAL '8 days', 'Bay 3 (Dyno Cell)', 'Hans Gruber (Chief Powertrain)', 'Bespoke titanium exhaust and ECU map audit.', 'PENDING')
ON CONFLICT DO NOTHING;

-- 15. Notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(2, 'VIP Test Drive Confirmed', 'Your private runway trial session for the Ferrari 488 Pista has been confirmed for Runway 24L.', 'SUCCESS', false),
(2, 'Order Update #ORD-2026-9041', 'Your deposit of $100,000 has been verified in secure escrow. Vehicle is currently undergoing pre-flight logistics inspection.', 'INFO', false),
(1, 'New VIP Lead Assigned', 'Lord Julian Beaumont has submitted a priority inquiry regarding the Ferrari 488 Pista.', 'ALERT', false)
ON CONFLICT DO NOTHING;
