export type UserRole = 'employee' | 'guest' | 'admin' | 'vendor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  walletBalance: number; // Pre-set value for employees (e.g., $150.00)
  employeeId?: string;
  department?: string;
  guestPassCode?: string;
}

export type FoodCategory = 'all' | 'breakfast' | 'lunch' | 'snacks' | 'beverages';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<FoodCategory, 'all'>;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
  calories: number;
  prepTime: string;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
}

export type OrderStatus = 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED';

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  isVeg: boolean;
}

export interface Order {
  id: string;
  ticketCode: string; // Unique string embedded in QR Code
  userId: string;
  userName: string;
  userRole: 'employee' | 'guest';
  employeeId?: string;
  userDepartment?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; // ISO String
  redeemedAt?: string; // ISO String
  redeemedByVendor?: string;
  notes?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number; // negative for spend, positive for reload
  type: 'ORDER_PAYMENT' | 'ADMIN_CREDIT' | 'REFUND';
  orderId?: string;
  description: string;
  timestamp: string;
  balanceAfter: number;
}

export interface FilterOptions {
  category: FoodCategory;
  searchQuery: string;
  isVegOnly: boolean;
}

export interface AdminDateFilter {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  roleFilter: 'all' | 'employee' | 'guest';
  statusFilter: 'all' | OrderStatus;
}
