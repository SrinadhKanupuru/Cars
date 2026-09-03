-- =========================================================================
-- SPEEDX MOTORS - Clean Production Database Initialization
-- System roles, default administrator account, and service catalog
-- =========================================================================

-- 1. System Roles
INSERT INTO roles (id, name, description) VALUES 
(1, 'ADMIN', 'Dealership Management & Principal Admin with full system access'),
(2, 'CUSTOMER', 'VIP Client & Private Collector Portal access')
ON CONFLICT (id) DO NOTHING;

-- 2. System Administrator Account (Password: 'password123' / 'admin123' / 'admin')
INSERT INTO users (id, name, email, password_hash, role_id, phone, status, avatar) VALUES
(1, 'Dealership Administrator', 'admin@speedxmotors.com', '$2a$10$EqnEqRTIt60riHTrIHSwXOpkkvFyKE1v8jppbmp7ORgD.xlKehTrG', 1, '+1 (800) 773-3390', 'ACTIVE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- 3. Dealership Service Catalog (Offerings definition)
INSERT INTO services (id, title, category, short_desc, full_desc, price_range, timeline, icon, is_active) VALUES
(1, 'White-Glove Global Logistics', 'Logistics', 'Climate-controlled enclosed transport and private air freight to any estate or yacht globally.', 'Hermetically sealed, temperature-regulated transport pods with GPS satellite tracking and $25M transit insurance policy coverage.', '$5,000 - $35,000', '2 - 7 Business Days', 'Truck', true),
(2, 'Track-Side Telemetry & Support', 'Motorsport', 'Dedicated pit crew, telemetry engineers, and tire support for your private circuit days.', 'Comprehensive pit crew deployment including master telemetry data engineers, tire warmers, race fuel management, and real-time video telemetry analysis.', '$8,500 / Day', 'On Demand', 'Gauge', true),
(3, 'Bespoke Performance Engineering', 'Tuning & Dynamics', 'Factory-certified power upgrades, bespoke exhaust fabrication, and suspension optimization.', 'Bespoke titanium exhaust design, ECU recalibration on AWD dyno cell, suspension geometry setup, and carbon composite aero tuning.', '$12,000 - $85,000', '1 - 3 Weeks', 'Zap', true),
(4, 'Ceramic Armor & Self-Healing PPF', 'Aesthetics', 'Clean-room 10-mil self-healing Paint Protection Film and 9H dual-layer ceramic shielding.', 'Complete disassembly and full-body edge-wrapped 10-mil polyurethane film application inside our ISO-certified clean-room bay.', '$6,500 - $14,000', '3 - 5 Days', 'ShieldCheck', true),
(5, 'Discreet International Escrow', 'Finance & Advisory', 'Multi-jurisdiction wealth structuring, tax-optimized leasing, and instant crypto settlement.', 'Discreet acquisition support through Swiss, Monaco, and Delaware escrow accounts with multi-currency and crypto settlement pipelines.', '0.5% - 1.0% Escrow', 'Instant / Same-Day', 'Award', true),
(6, 'Factory Certification & Maintenance', 'Mechanical Audit', '250-point factory audit, fluid spectrometer testing, and telemetry health diagnostic.', 'Comprehensive mechanical audit performed exclusively by certified Master Technicians with genuine OEM telemetry tools.', '$3,500 - $9,500', '1 - 2 Days', 'FileCheck', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Synchronize ID Sequences
SELECT setval('roles_id_seq', COALESCE((SELECT MAX(id) FROM roles), 1));
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval('services_id_seq', COALESCE((SELECT MAX(id) FROM services), 1));
