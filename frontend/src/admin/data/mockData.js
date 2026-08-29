export const mockSummary = {
  totalOrders: 1248,
  totalRevenue: 2450000,
  totalCustomers: 856,
  totalProducts: 342,
  pendingOrders: 45
};

export const mockProducts = [
  {
    id: 'PRD-001',
    name: 'Royal Maroon Silk Lehenga',
    category: 'Bridal',
    sku: 'RML-001',
    price: 45000,
    stock: 12,
    status: 'Active',
    image: 'https://placehold.co/100x100?text=Lehenga'
  },
  {
    id: 'PRD-002',
    name: 'Gold Embroidered Sherwani',
    category: 'Menswear',
    sku: 'GES-002',
    price: 35000,
    stock: 5,
    status: 'Low Stock',
    image: 'https://placehold.co/100x100?text=Sherwani'
  },
  {
    id: 'PRD-003',
    name: 'Pearl Embedded Anarkali',
    category: 'Womenswear',
    sku: 'PEA-003',
    price: 25000,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://placehold.co/100x100?text=Anarkali'
  }
];

export const mockOrders = [
  {
    id: 'ORD-5432',
    customer: 'Aisha Khan',
    amount: 45000,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    date: '2023-10-24'
  },
  {
    id: 'ORD-5431',
    customer: 'Rahul Verma',
    amount: 35000,
    paymentStatus: 'Pending',
    orderStatus: 'Confirmed',
    date: '2023-10-23'
  },
  {
    id: 'ORD-5430',
    customer: 'Priya Sharma',
    amount: 25000,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    date: '2023-10-22'
  }
];

export const mockCustomers = [
  {
    id: 'CUS-101',
    name: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    orders: 3,
    totalSpend: 135000,
    joinedDate: '2023-01-15'
  },
  {
    id: 'CUS-102',
    name: 'Rahul Verma',
    email: 'rahul.v@example.com',
    orders: 1,
    totalSpend: 35000,
    joinedDate: '2023-05-20'
  }
];

export const mockCategories = [
  {
    id: 'CAT-1',
    name: 'Bridal',
    slug: 'bridal',
    status: 'Active',
    productsCount: 45
  },
  {
    id: 'CAT-2',
    name: 'Menswear',
    slug: 'menswear',
    status: 'Active',
    productsCount: 82
  }
];
