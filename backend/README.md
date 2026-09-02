# SPEEDX MOTORS — Backend REST API

> **Drive the Extraordinary** — High-performance RESTful API backend for the SPEEDX MOTORS Luxury Sports Car Dealership System.

Built with **Node.js, Express.js, PostgreSQL, pg, JSON Web Tokens (JWT), bcryptjs, CORS, and Express Validator**.

---

## 🏎️ Features & Architecture

- **PostgreSQL Relational Database**: Full 15-table relational schema with strict foreign keys, CHECK constraints, CASCADE deletes, and query indexes.
- **Role-Based Access Control (RBAC)**: Secure separation between `ADMIN` (Dealership Principal & Concierge) and `CUSTOMER` (VIP Private Collectors).
- **Authentication & Security**: JWT bearer authentication, bcrypt password hashing, input validation sanitization, parameterized SQL queries against SQL injection.
- **Inventory Engine**: Comprehensive hypercar CRUD with advanced multi-criteria filtering (brand, price, year, horsepower, transmission, status, search), dynamic sorting, and pagination.
- **VIP Customer Suite**: Profile management, wishlist bookmarking, test drive booking on private runways, vehicle acquisition orders, and transaction receipts.
- **Dealership SaaS Management**: Real-time KPI reporting, revenue aggregations, lead pipeline stages, workshop service bay scheduling, and staff audits.

---

## 📁 Folder Structure

```
backend/
├── database/
│   ├── schema.sql           # Complete PostgreSQL DDL schema & indexes
│   ├── seed.sql             # Demo dataset with hypercars & transactions
│   ├── migrate.js           # Schema migration runner
│   ├── seed.js              # Seed data runner
│   └── setup.js             # Combined migration + seed runner
├── src/
│   ├── config/
│   │   └── database.js      # pg Pool connection configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── carController.js
│   │   ├── wishlistController.js
│   │   ├── customerController.js
│   │   ├── leadController.js
│   │   ├── testDriveController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── serviceController.js
│   │   ├── reportController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validateMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── carRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── leadRoutes.js
│   │   ├── testDriveRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── reportRoutes.js
│   │   └── notificationRoutes.js
│   └── app.js               # Express application configuration & routing
├── server.js                # Server entrypoint with DB connection audit
├── package.json
├── .env
├── .env.example
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18.0.0 or higher
- **PostgreSQL** v14.0 or higher

---

## 🚀 Getting Started

### 1. Install Dependencies
```powershell
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and adjust the PostgreSQL connection details:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres@localhost:5433/speedx_motors
JWT_SECRET=speedx_motors_luxury_hypercar_jwt_super_secret_key_2026_!@#
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5174
```

### 3. Initialize Database & Seed Demo Data
Run the automated schema migration and seed script:
```powershell
npm run db:setup
```
*(Or individually via `npm run migrate` and `npm run seed`)*

### 4. Run Development Server
```powershell
npm run dev
```

### 5. Run Production Server
```powershell
npm start
```

---

## 🔐 Default Demo Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@speedxmotors.com` | `password123` | Full Dealership Management, Cars CRUD, Orders, Reports |
| **CUSTOMER** | `customer@speedxmotors.com` | `password123` | VIP Profile, Saved Wishlist, Runway Test Drives, Orders |
| **CUSTOMER** | `elena.rostova@monacowealth.mc` | `password123` | Private Investor Profile, Orders, Escrow Payments |

---

## 📡 REST API Endpoint Documentation

### 🩺 Health Check
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System status and API version |

---

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new VIP Customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT bearer token |
| `GET` | `/api/auth/me` | Protected | Retrieve authenticated user profile and role |
| `POST` | `/api/auth/logout` | Public | Sign out and invalidate session |

---

### 🏎️ Hypercar Inventory (`/api/cars`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cars` | Public | List showroom vehicles (supports search, filters, sort, pagination) |
| `GET` | `/api/cars/:id` | Public | Get vehicle details with all images and equipment |
| `POST` | `/api/cars` | Admin | Create and catalog new vehicle |
| `PUT` | `/api/cars/:id` | Admin | Update vehicle specifications and status |
| `DELETE`| `/api/cars/:id` | Admin | Remove vehicle from showroom inventory |

**Query Parameters for `GET /api/cars`:**
- `brand` (e.g. `Ferrari`, `Porsche`, `Lamborghini`)
- `minPrice` & `maxPrice` (e.g. `minPrice=200000&maxPrice=800000`)
- `year` (e.g. `2024`)
- `minHorsepower` (e.g. `600`)
- `transmission` (e.g. `Dual-Clutch`, `Automatic`)
- `status` (`AVAILABLE`, `RESERVED`, `SOLD`)
- `search` (e.g. `Pista`, `SVJ`, `Turbo`)
- `sortBy` (`price_asc`, `price_desc`, `newest`, `oldest`, `horsepower`)
- `page` (default: `1`)
- `limit` (default: `12`)

---

### ❤️ Wishlist (`/api/wishlist`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/wishlist` | Customer | View customer's saved cars |
| `POST` | `/api/wishlist/:carId` | Customer | Save car to wishlist |
| `DELETE`| `/api/wishlist/:carId` | Customer | Remove car from wishlist |

---

### 👤 Customer Profile (`/api/customers`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/customers/me` | Customer | View customer's own dossier |
| `PUT` | `/api/customers/me` | Customer | Update customer's contact details and address |
| `GET` | `/api/customers` | Admin | List all dealership clients |
| `GET` | `/api/customers/:id` | Admin | View specific client dossier |

---

### 📋 Inquiries & Leads (`/api/leads`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leads` | Public | Submit VIP inquiry / allocation dossier request |
| `GET` | `/api/leads` | Admin | List inquiries with status filtering (`NEW`, `CONTACTED`, `QUALIFIED`, `CONVERTED`, `LOST`) |
| `GET` | `/api/leads/:id` | Admin | View specific lead details |
| `PUT` | `/api/leads/:id/status` | Admin | Update lead stage, notes, and sales concierge assignment |
| `DELETE`| `/api/leads/:id` | Admin | Delete lead record |

---

### 🏁 Runway Test Drives (`/api/test-drives`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/test-drives` | Customer | Book private runway / circuit test drive |
| `GET` | `/api/test-drives/my` | Customer | View customer's booked test drive schedule |
| `GET` | `/api/test-drives` | Admin | View all dealership test drive bookings |
| `GET` | `/api/test-drives/:id` | Protected | View single test drive appointment |
| `PUT` | `/api/test-drives/:id/status`| Admin | Update status (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`) |

---

### 📦 Vehicle Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Customer | Create vehicle acquisition order |
| `GET` | `/api/orders/my` | Customer | View customer's orders and fulfillment progress |
| `GET` | `/api/orders` | Admin | View all dealership acquisition orders |
| `GET` | `/api/orders/:id` | Protected | View order details |
| `PUT` | `/api/orders/:id/status` | Admin | Update order status (`PENDING`, `CONFIRMED`, `PROCESSING`, `COMPLETED`, `CANCELLED`) |

---

### 💳 Payments & Escrow (`/api/payments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments` | Protected | Record payment / deposit transaction |
| `GET` | `/api/payments/my` | Customer | View transaction history & escrow receipts |
| `GET` | `/api/payments` | Admin | View dealership treasury ledger |
| `GET` | `/api/payments/:id` | Protected | View payment receipt |
| `PUT` | `/api/payments/:id/status`| Admin | Update payment status (`PENDING`, `PAID`, `FAILED`, `REFUNDED`) |

---

### 🛠️ Ownership Services (`/api/services`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | Public | List dealership services catalog |
| `POST` | `/api/services/bookings` | Public/User | Book a service appointment |
| `GET` | `/api/services/bookings/my` | Customer | View customer's service bookings |
| `POST` | `/api/services` | Admin | Create dealership service |
| `PUT` | `/api/services/:id` | Admin | Update dealership service |
| `DELETE`| `/api/services/:id` | Admin | Delete dealership service |
| `GET` | `/api/services/bookings` | Admin | View all workshop bay bookings |
| `PUT` | `/api/services/bookings/:id/status`| Admin | Update booking status (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`) |

---

### 📊 SaaS Reports & Metrics (`/api/reports`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports/dashboard` | Admin | Real-time KPI summary (cars, orders, revenue, leads) |
| `GET` | `/api/reports/sales` | Admin | Monthly sales volume and deposit aggregations |
| `GET` | `/api/reports/revenue` | Admin | Revenue breakdown by payment method |
| `GET` | `/api/reports/top-brands` | Admin | Brand distribution and average price metrics |
| `GET` | `/api/reports/recent-orders`| Admin | Recent vehicle acquisitions |
| `GET` | `/api/reports/recent-leads` | Admin | Recent VIP client inquiries |

---

### 🔔 Notifications (`/api/notifications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Protected | List notifications for authenticated user |
| `PUT` | `/api/notifications/:id/read`| Protected | Mark notification as read |
