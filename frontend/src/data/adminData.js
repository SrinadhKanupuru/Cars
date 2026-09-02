export const initialAdminStats = {
  totalCars: 28,
  totalCustomers: 142,
  totalOrders: 64,
  totalRevenue: 24850000,
  monthlyGrowth: {
    cars: "+12%",
    customers: "+24%",
    orders: "+18%",
    revenue: "+31%"
  }
};

export const salesChartData = [
  { month: "Jan", sales: 4, revenue: 1850000 },
  { month: "Feb", sales: 6, revenue: 2900000 },
  { month: "Mar", sales: 5, revenue: 2400000 },
  { month: "Apr", sales: 8, revenue: 4100000 },
  { month: "May", sales: 7, revenue: 3600000 },
  { month: "Jun", sales: 9, revenue: 4800000 },
  { month: "Jul", sales: 11, revenue: 5200000 }
];

export const topBrandsData = [
  { brand: "Ferrari", percentage: 34, count: "18 Models", revenue: "$11.2M" },
  { brand: "Porsche", percentage: 26, count: "14 Models", revenue: "$6.8M" },
  { brand: "Lamborghini", percentage: 20, count: "9 Models", revenue: "$5.4M" },
  { brand: "McLaren", percentage: 12, count: "6 Models", revenue: "$3.2M" },
  { brand: "Others", percentage: 8, count: "4 Models", revenue: "$2.1M" }
];

export const initialOrders = [
  {
    id: "ORD-9821",
    customerName: "Julian Beaumont",
    customerEmail: "j.beaumont@prestigegroup.ch",
    carName: "Ferrari SF90 Stradale",
    vin: "ZFF90LA45N0289142",
    amount: 625000,
    depositPaid: 150000,
    orderDate: "2026-08-20",
    status: "Logistics & Transport",
    paymentStatus: "Escrow Verified",
    deliveryAddress: "Geneva FreePort & Residence, Switzerland",
    estimatedDelivery: "2026-08-30"
  },
  {
    id: "ORD-9818",
    customerName: "Lady Vivienne Sterling",
    customerEmail: "v.sterling@mayfaircapital.co.uk",
    carName: "Porsche 911 GT3 RS",
    vin: "WP0AF2A97RS198422",
    amount: 385000,
    depositPaid: 385000,
    orderDate: "2026-08-16",
    status: "Delivered",
    paymentStatus: "Paid in Full",
    deliveryAddress: "Monaco Yacht Club Berth B12",
    estimatedDelivery: "2026-08-22"
  },
  {
    id: "ORD-9814",
    customerName: "Kaito Takahashi",
    customerEmail: "takahashi@tokyofinance.jp",
    carName: "Koenigsegg Jesko Attack",
    vin: "YT9K142A9NL001204",
    amount: 3950000,
    depositPaid: 1000000,
    orderDate: "2026-08-10",
    status: "Final Pre-Delivery Inspection",
    paymentStatus: "Escrow Verified",
    deliveryAddress: "Roppongi Hills Garage, Minato-ku, Tokyo",
    estimatedDelivery: "2026-09-05"
  },
  {
    id: "ORD-9805",
    customerName: "Alexander Vance",
    customerEmail: "avance@beverlyfunds.com",
    carName: "McLaren 750S Spider",
    vin: "SBM14RAB7NW001923",
    amount: 415000,
    depositPaid: 100000,
    orderDate: "2026-07-28",
    status: "Delivered",
    paymentStatus: "Paid in Full",
    deliveryAddress: "Sunset Boulevard Villa, Los Angeles, CA",
    estimatedDelivery: "2026-08-04"
  }
];

export const initialTestDrives = [
  {
    id: "TD-4401",
    customerName: "Christian Dubois",
    customerEmail: "c.dubois@luxcapital.fr",
    customerPhone: "+33 6 12 34 56 78",
    carId: "sf90-stradale",
    carName: "Ferrari SF90 Stradale",
    carImage: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=200&q=80",
    date: "2026-08-28",
    timeSlot: "14:00 - 15:30",
    location: "SpeedX Private Runway & Circuit, Thermal CA",
    assignedConcierge: "Marco Rossi (Senior Specialist)",
    status: "Confirmed",
    notes: "Client is comparing with McLaren 750S Spider. Wants high speed runway pass."
  },
  {
    id: "TD-4402",
    customerName: "Sophia Al-Mansoor",
    customerEmail: "sophia@almansoorholdings.ae",
    customerPhone: "+971 50 987 6543",
    carId: "revuelto-v12",
    carName: "Lamborghini Revuelto V12",
    carImage: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=200&q=80",
    date: "2026-08-29",
    timeSlot: "11:00 - 12:30",
    location: "Dubai Autodrome VIP Pit Lane",
    assignedConcierge: "Tariq Zayed",
    status: "Confirmed",
    notes: "Requires enclosed transport test at Dubai Hills estate."
  },
  {
    id: "TD-4403",
    customerName: "Maximilian Richter",
    customerEmail: "m.richter@munichventures.de",
    customerPhone: "+49 170 555 1234",
    carId: "911-gt3-rs",
    carName: "Porsche 911 GT3 RS",
    carImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=80",
    date: "2026-08-30",
    timeSlot: "16:00 - 17:30",
    location: "Nürburgring GP Lounge",
    assignedConcierge: "Hans Weber",
    status: "Pending Approval",
    notes: "First time customer, requested telemetry instructor."
  },
  {
    id: "TD-4404",
    customerName: "Lord Julian Beaumont",
    customerEmail: "j.beaumont@prestigegroup.ch",
    customerPhone: "+41 22 765 4321",
    carId: "jesko-attack",
    carName: "Koenigsegg Jesko Attack",
    carImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80",
    date: "2026-09-02",
    timeSlot: "10:00 - 11:30",
    location: "Monaco FreePort & Grand Prix Track",
    assignedConcierge: "Sebastian Vance",
    status: "Confirmed",
    notes: "Aerodynamic downforce test on coastal circuit."
  },
  {
    id: "TD-4405",
    customerName: "Elena Rostova",
    customerEmail: "e.rostova@genevaventures.ch",
    customerPhone: "+41 79 123 4567",
    carId: "mclaren-750s",
    carName: "McLaren 750S Spider",
    carImage: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=200&q=80",
    date: "2026-09-04",
    timeSlot: "13:30 - 15:00",
    location: "Silverstone International Paddock",
    assignedConcierge: "Elena Chen",
    status: "Pending Approval",
    notes: "Client requested carbon ceramic brake temperature monitoring."
  },
  {
    id: "TD-4406",
    customerName: "Kaito Takahashi",
    customerEmail: "takahashi@tokyofinance.jp",
    customerPhone: "+81 3 5555 0192",
    carId: "bugatti-chiron",
    carName: "Bugatti Chiron Pur Sport",
    carImage: "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=200&q=80",
    date: "2026-08-25",
    timeSlot: "15:00 - 16:30",
    location: "Fuji Speedway VIP Circuit",
    assignedConcierge: "Kenji Sato",
    status: "Completed",
    notes: "Full telemetry analysis delivered to client suite."
  }
];

export const initialLeads = [
  {
    id: "LEAD-701",
    customerName: "David Sterling Jr.",
    email: "david@sterlingholdings.com",
    phone: "+1 (310) 555-8910",
    interestCar: "Bugatti Chiron Pur Sport",
    budget: "$4.5M",
    stage: "VIP Appointment",
    priority: "Urgent",
    createdAt: "2026-08-24",
    assignedTo: "Marco Rossi",
    notes: "Wants trade-in consultation for 2021 Chiron Sport."
  },
  {
    id: "LEAD-702",
    customerName: "Camilla De Luca",
    email: "camilla.deluca@milanoart.it",
    phone: "+39 02 8899 441",
    interestCar: "Ferrari 296 GTB",
    budget: "$450k",
    stage: "Contacted",
    priority: "High",
    createdAt: "2026-08-24",
    assignedTo: "Matteo Bianchi",
    notes: "Interested in bespoke interior personalization."
  },
  {
    id: "LEAD-703",
    customerName: "Vikram Singhania",
    email: "vikram@singhaniagroup.in",
    phone: "+91 98200 12345",
    interestCar: "Rolls-Royce Spectre",
    budget: "$600k",
    stage: "Contract Sent",
    priority: "Urgent",
    createdAt: "2026-08-22",
    assignedTo: "Elena Chen",
    notes: "Looking for tax structuring in Singapore / Dubai."
  },
  {
    id: "LEAD-704",
    customerName: "Henrik Lindqvist",
    email: "henrik@nordicasset.se",
    phone: "+46 8 123 4567",
    interestCar: "Koenigsegg Jesko Attack",
    budget: "$4.0M",
    stage: "New Inquiry",
    priority: "Medium",
    createdAt: "2026-08-25",
    assignedTo: "Unassigned",
    notes: "Web inquiry regarding custom livery options."
  }
];

export const initialCustomers = [
  {
    id: "CUST-101",
    name: "Julian Beaumont",
    email: "j.beaumont@prestigegroup.ch",
    phone: "+41 22 765 4321",
    tier: "Diamond VIP",
    totalPurchases: 3,
    totalSpent: 1850000,
    location: "Geneva, Switzerland",
    joinedDate: "2024-03-15",
    status: "Active"
  },
  {
    id: "CUST-102",
    name: "Lady Vivienne Sterling",
    email: "v.sterling@mayfaircapital.co.uk",
    phone: "+44 20 7946 0912",
    tier: "Platinum VIP",
    totalPurchases: 2,
    totalSpent: 890000,
    location: "London & Monaco",
    joinedDate: "2024-11-20",
    status: "Active"
  },
  {
    id: "CUST-103",
    name: "Kaito Takahashi",
    email: "takahashi@tokyofinance.jp",
    phone: "+81 3 5555 0192",
    tier: "Black Centurion VIP",
    totalPurchases: 4,
    totalSpent: 6200000,
    location: "Tokyo, Japan",
    joinedDate: "2023-08-01",
    status: "Active"
  },
  {
    id: "CUST-104",
    name: "Alexander Vance",
    email: "avance@beverlyfunds.com",
    phone: "+1 (310) 441-9920",
    tier: "Platinum VIP",
    totalPurchases: 2,
    totalSpent: 920000,
    location: "Beverly Hills, USA",
    joinedDate: "2025-01-10",
    status: "Active"
  }
];

export const initialPayments = [
  {
    id: "PAY-501",
    orderId: "ORD-9821",
    customer: "Julian Beaumont",
    car: "Ferrari SF90 Stradale",
    amount: 150000,
    type: "Wire Transfer",
    date: "2026-08-20",
    status: "Escrow Cleared",
    reference: "WT-CH938210984"
  },
  {
    id: "PAY-502",
    orderId: "ORD-9818",
    customer: "Lady Vivienne Sterling",
    car: "Porsche 911 GT3 RS",
    amount: 385000,
    type: "Private Wealth Wire",
    date: "2026-08-16",
    status: "Completed",
    reference: "WT-UK88219401"
  },
  {
    id: "PAY-503",
    orderId: "ORD-9814",
    customer: "Kaito Takahashi",
    car: "Koenigsegg Jesko Attack",
    amount: 1000000,
    type: "Crypto Escrow (USDC)",
    date: "2026-08-10",
    status: "Escrow Cleared",
    reference: "0x89f4b2...3a91"
  }
];

export const initialServiceBookings = [
  {
    id: "SRV-301",
    customerName: "Julian Beaumont",
    carModel: "Ferrari SF90 Stradale",
    serviceType: "Graphene Ceramic Armor + PPF Inspection",
    bayNumber: "Bay 1 (Sterile Clean Room)",
    scheduledDate: "2026-08-27",
    status: "In Progress",
    technician: "Gianluca Moretti"
  },
  {
    id: "SRV-302",
    customerName: "Kaito Takahashi",
    carModel: "Koenigsegg Jesko Attack",
    serviceType: "Pre-Delivery Telemetry Calibration",
    bayNumber: "Bay 3 (Dyno & Telemetry Lab)",
    scheduledDate: "2026-08-29",
    status: "Scheduled",
    technician: "Sven Lindholm"
  },
  {
    id: "SRV-303",
    customerName: "Marcus Vance",
    carModel: "McLaren 750S Spider",
    serviceType: "Akrapovič Titanium Exhaust Retrofit",
    bayNumber: "Bay 2 (Motorsport Tuning)",
    scheduledDate: "2026-08-31",
    status: "Confirmed",
    technician: "David Miller"
  }
];

export const initialStaffUsers = [
  {
    id: "USR-01",
    name: "Sebastian Vance",
    email: "s.vance@speedxmotors.com",
    role: "Super Admin / Dealership Principal",
    status: "Active",
    lastLogin: "Just now"
  },
  {
    id: "USR-02",
    name: "Marco Rossi",
    email: "m.rossi@speedxmotors.com",
    role: "Senior Sales Concierge",
    status: "Active",
    lastLogin: "2 hours ago"
  },
  {
    id: "USR-03",
    name: "Elena Chen",
    email: "e.chen@speedxmotors.com",
    role: "VIP Client Relations & Escrow",
    status: "Active",
    lastLogin: "Yesterday"
  },
  {
    id: "USR-04",
    name: "Gianluca Moretti",
    email: "g.moretti@speedxmotors.com",
    role: "Master Technical Director",
    status: "Active",
    lastLogin: "3 days ago"
  }
];

export const initialActivityLogs = [
  {
    id: 1,
    action: "New Order Placed",
    detail: "Julian Beaumont deposited $150,000 for Ferrari SF90 Stradale",
    time: "35 minutes ago",
    type: "order"
  },
  {
    id: 2,
    action: "Test Drive Approved",
    detail: "Sophia Al-Mansoor confirmed for Lamborghini Revuelto at Dubai Autodrome",
    time: "2 hours ago",
    type: "testdrive"
  },
  {
    id: 3,
    action: "New VIP Lead Registered",
    detail: "David Sterling Jr. requested consultation on Bugatti Chiron Pur Sport",
    time: "5 hours ago",
    type: "lead"
  },
  {
    id: 4,
    action: "Inventory Updated",
    detail: "Added 2024 Koenigsegg Jesko Attack (1,600 HP)",
    time: "1 day ago",
    type: "car"
  }
];
