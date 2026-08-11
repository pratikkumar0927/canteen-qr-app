import type { User, FoodItem, Order } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-emp-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@techcorp.com',
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    walletBalance: 150.00, // Requirement 4: pre-set wallet value
    employeeId: 'EMP-1042',
    department: 'Software Engineering',
  },
  {
    id: 'usr-emp-2',
    name: 'Sophia Chen',
    email: 'sophia.chen@techcorp.com',
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    walletBalance: 120.00,
    employeeId: 'EMP-1088',
    department: 'Product Design',
  },
  {
    id: 'usr-guest-1',
    name: 'David Miller (Guest)',
    email: 'david.visitor@partner.org',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    walletBalance: 0.00,
    guestPassCode: 'GST-PASS-9901',
  },
  {
    id: 'usr-admin-1',
    name: 'Elena Rostova',
    email: 'admin.dining@techcorp.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    walletBalance: 999.00,
    employeeId: 'ADM-0001',
    department: 'Corporate Dining Services',
  },
  {
    id: 'usr-vendor-1',
    name: 'Food Counter #1',
    email: 'vendor.counter1@techcorp.com',
    role: 'vendor',
    avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200',
    walletBalance: 0.00,
    department: 'Main Food Hall',
  }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Avocado & Egg Toast',
    description: 'Sourdough bread topped with fresh smashed avocado, poached organic egg, chili flakes & microgreens.',
    price: 8.50,
    category: 'breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    calories: 380,
    prepTime: '8-10 mins',
  },
  {
    id: 'food-2',
    name: 'Mediterranean Protein Bowl',
    description: 'Quinoa, charred chickpea, cherry tomatoes, cucumbers, kalamata olives & feta with herb dressing.',
    price: 12.00,
    category: 'lunch',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    calories: 520,
    prepTime: '10-12 mins',
  },
  {
    id: 'food-3',
    name: 'Tuscan Grilled Chicken Panini',
    description: 'Artisan ciabatta, grilled free-range chicken breast, sundried tomato pesto, provolone cheese.',
    price: 14.50,
    category: 'lunch',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600',
    isVeg: false,
    isAvailable: true,
    calories: 650,
    prepTime: '12-15 mins',
  },
  {
    id: 'food-4',
    name: 'Iced Artisan Matcha Latte',
    description: 'Ceremonial grade Uji matcha whisked with oat milk and subtle vanilla blossom nectar.',
    price: 5.50,
    category: 'beverages',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    calories: 180,
    prepTime: '3 mins',
  },
  {
    id: 'food-5',
    name: 'Crispy Falafel Pita Wrap',
    description: 'Golden falafel, creamy tahini, pickled turnip, mint & fresh parsley wrapped in warm pita.',
    price: 11.00,
    category: 'lunch',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    calories: 490,
    prepTime: '8 mins',
  },
  {
    id: 'food-6',
    name: 'Organic Berry Acai Bowl',
    description: 'Blended acai smoothie topped with chia seeds, banana slices, toasted coconut flakes & house granola.',
    price: 9.50,
    category: 'breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    calories: 320,
    prepTime: '5 mins',
  },
  {
    id: 'food-7',
    name: 'Parmesan Truffle Fries',
    description: 'Hand-cut golden potatoes tossed in white truffle oil, grated Parmigiano-Reggiano & rosemary.',
    price: 7.00,
    category: 'snacks',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    calories: 440,
    prepTime: '7 mins',
  },
  {
    id: 'food-8',
    name: 'Cold Brew Nitro Coffee',
    description: 'Slow-steeped single origin Ethiopian beans infused with nitrogen for a velvety foam head.',
    price: 4.50,
    category: 'beverages',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    calories: 15,
    prepTime: '2 mins',
  },
  {
    id: 'food-9',
    name: 'BBQ Pulled Pork Sliders',
    description: 'Slow-roasted pork shoulder in hickory BBQ sauce with apple cider slaw on brioche buns.',
    price: 13.00,
    category: 'snacks',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600',
    isVeg: false,
    isAvailable: false, // Stock out demo
    calories: 610,
    prepTime: '10 mins',
  }
];

// Seed dates helper (returns ISO strings relative to current date)
const getIsoDateDaysAgo = (daysAgo: number, hour = 12, min = 30) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    ticketCode: 'QR-EMP-2026-8812',
    userId: 'usr-emp-1',
    userName: 'Alex Rivera',
    userRole: 'employee',
    employeeId: 'EMP-1042',
    userDepartment: 'Software Engineering',
    items: [
      { itemId: 'food-2', name: 'Mediterranean Protein Bowl', price: 12.00, quantity: 1, imageUrl: INITIAL_FOOD_ITEMS[1].imageUrl, isVeg: true },
      { itemId: 'food-4', name: 'Iced Artisan Matcha Latte', price: 5.50, quantity: 1, imageUrl: INITIAL_FOOD_ITEMS[3].imageUrl, isVeg: true },
    ],
    totalAmount: 17.50,
    status: 'REDEEMED',
    createdAt: getIsoDateDaysAgo(0, 11, 15), // Today 11:15 AM
    redeemedAt: getIsoDateDaysAgo(0, 11, 45),
    redeemedByVendor: 'Food Counter #1',
    notes: 'Extra napkin please'
  },
  {
    id: 'ord-1002',
    ticketCode: 'QR-GST-2026-4419',
    userId: 'usr-guest-1',
    userName: 'David Miller (Guest)',
    userRole: 'guest',
    items: [
      { itemId: 'food-3', name: 'Tuscan Grilled Chicken Panini', price: 14.50, quantity: 1, imageUrl: INITIAL_FOOD_ITEMS[2].imageUrl, isVeg: false },
      { itemId: 'food-8', name: 'Cold Brew Nitro Coffee', price: 4.50, quantity: 1, imageUrl: INITIAL_FOOD_ITEMS[7].imageUrl, isVeg: true }
    ],
    totalAmount: 19.00,
    status: 'ACTIVE', // Ready to scan!
    createdAt: getIsoDateDaysAgo(0, 13, 0), // Today 1:00 PM
  },
  {
    id: 'ord-1003',
    ticketCode: 'QR-EMP-2026-3021',
    userId: 'usr-emp-2',
    userName: 'Sophia Chen',
    userRole: 'employee',
    employeeId: 'EMP-1088',
    userDepartment: 'Product Design',
    items: [
      { itemId: 'food-1', name: 'Avocado & Egg Toast', price: 8.50, quantity: 1, imageUrl: INITIAL_FOOD_ITEMS[0].imageUrl, isVeg: true },
      { itemId: 'food-4', name: 'Iced Artisan Matcha Latte', price: 5.50, quantity: 1, imageUrl: INITIAL_FOOD_ITEMS[3].imageUrl, isVeg: true }
    ],
    totalAmount: 14.00,
    status: 'REDEEMED',
    createdAt: getIsoDateDaysAgo(1, 9, 30), // Yesterday
    redeemedAt: getIsoDateDaysAgo(1, 9, 50),
    redeemedByVendor: 'Food Counter #1'
  },
  {
    id: 'ord-1004',
    ticketCode: 'QR-GST-2026-9055',
    userId: 'usr-guest-1',
    userName: 'David Miller (Guest)',
    userRole: 'guest',
    items: [
      { itemId: 'food-6', name: 'Organic Berry Acai Bowl', price: 9.50, quantity: 1, imageUrl: INITIAL_FOOD_ITEMS[5].imageUrl, isVeg: true }
    ],
    totalAmount: 9.50,
    status: 'REDEEMED',
    createdAt: getIsoDateDaysAgo(2, 8, 45), // 2 days ago
    redeemedAt: getIsoDateDaysAgo(2, 9, 0),
    redeemedByVendor: 'Food Counter #1'
  }
];
