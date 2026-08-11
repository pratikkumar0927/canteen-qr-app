import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, FoodItem, CartItem, Order } from '../types';
import { INITIAL_USERS, INITIAL_FOOD_ITEMS, INITIAL_ORDERS } from '../data/initialData';

interface AppContextType {
  currentUser: User;
  users: User[];
  switchUser: (userId: string) => void;
  
  foodItems: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, updated: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  toggleFoodAvailability: (id: string) => void;
  
  cart: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  orders: Order[];
  createOrder: (notes?: string) => Order | null;
  redeemOrder: (ticketCode: string) => { success: boolean; message: string; order?: Order };
  
  // Active modal controls
  activeTicket: Order | null;
  setActiveTicket: (order: Order | null) => void;
  
  // Theme & Frame View
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  
  resetAllData: () => void;
}

const STORAGE_KEYS = {
  USERS: 'canteen_qr_users_v1',
  FOOD_ITEMS: 'canteen_qr_food_items_v1',
  ORDERS: 'canteen_qr_orders_v1',
  CURRENT_USER_ID: 'canteen_qr_current_user_id_v1',
  THEME: 'canteen_qr_theme_v1',
  MOBILE_FRAME: 'canteen_qr_mobile_frame_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initialize Users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // 2. Initialize Current User
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || INITIAL_USERS[0].id;
  });

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  // 3. Initialize Food Items
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  // 4. Initialize Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // 5. Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTicket, setActiveTicket] = useState<Order | null>(null);

  // 6. UI Preferences
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  });

  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOBILE_FRAME);
    return saved ? JSON.parse(saved) : false;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOBILE_FRAME, JSON.stringify(isMobileFrame));
  }, [isMobileFrame]);

  // Switch Active User Persona
  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      setCart([]); // Reset cart when switching personas
    }
  };

  // Food Item Management (Admin)
  const addFoodItem = (newItemData: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...newItemData,
      id: `food-${Date.now()}`
    };
    setFoodItems(prev => [newItem, ...prev]);
  };

  const updateFoodItem = (id: string, updated: Partial<FoodItem>) => {
    setFoodItems(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleFoodAvailability = (id: string) => {
    setFoodItems(prev => prev.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item));
  };

  // Cart Management
  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(ci => ci.item.id === item.id);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += 1;
        return copy;
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(ci => {
        if (ci.item.id === itemId) {
          const newQty = ci.quantity + delta;
          return newQty > 0 ? { ...ci, quantity: newQty } : null;
        }
        return ci;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, ci) => sum + (ci.item.price * ci.quantity), 0);

  // Create Order & Generate QR Ticket Code
  const createOrder = (notes?: string): Order | null => {
    if (cart.length === 0) return null;

    const total = cartTotal;

    // For employee: verify wallet balance
    if (currentUser.role === 'employee') {
      if (currentUser.walletBalance < total) {
        alert(`Insufficient wallet balance! Current balance: $${currentUser.walletBalance.toFixed(2)}, Order total: $${total.toFixed(2)}`);
        return null;
      }
      // Deduct wallet balance
      setUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, walletBalance: u.walletBalance - total };
        }
        return u;
      }));
    }

    // Generate unique Ticket QR Code string (Requirements #6 & #7)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const ticketCode = `QR-${currentUser.role.slice(0, 3).toUpperCase()}-${datePrefix}-${randomSuffix}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      ticketCode,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role as 'employee' | 'guest',
      employeeId: currentUser.employeeId,
      userDepartment: currentUser.department,
      items: cart.map(ci => ({
        itemId: ci.item.id,
        name: ci.item.name,
        price: ci.item.price,
        quantity: ci.quantity,
        imageUrl: ci.item.imageUrl,
        isVeg: ci.item.isVeg,
      })),
      totalAmount: total,
      status: 'ACTIVE', // Available for single-use redemption
      createdAt: new Date().toISOString(),
      notes,
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setActiveTicket(newOrder); // Show instant QR code ticket modal
    return newOrder;
  };

  // Vendor QR Code Scanner Redemption Handler (Requirement #7: Redeem only ONCE)
  const redeemOrder = (rawInput: string): { success: boolean; message: string; order?: Order } => {
    let ticketCode = rawInput.trim();
    let payloadData: any = null;

    // Parse embedded QR JSON payload if present
    if (rawInput.includes('"tCode"')) {
      try {
        payloadData = JSON.parse(rawInput);
        if (payloadData.tCode) {
          ticketCode = payloadData.tCode;
        }
      } catch (e) {
        // Fallback to raw string
      }
    }

    let targetOrder = orders.find(o => o.ticketCode.toUpperCase() === ticketCode.toUpperCase());

    // Universal Cross-Device Handling: If order was created on another device/browser, register it dynamically
    if (!targetOrder && payloadData) {
      targetOrder = {
        id: `ord_${Date.now()}`,
        userId: 'ext_' + Date.now(),
        userName: payloadData.uName || 'Customer',
        userRole: payloadData.uRole || 'employee',
        items: [{ itemId: 'ext_item', name: payloadData.items || 'Food Order Items', price: payloadData.amt || 0, quantity: 1, imageUrl: '', isVeg: true }],
        totalAmount: payloadData.amt || 0,
        status: 'ACTIVE',
        createdAt: payloadData.created || new Date().toISOString(),
        ticketCode: payloadData.tCode
      };
    }

    if (!targetOrder) {
      return {
        success: false,
        message: `❌ INVALID QR CODE: "${ticketCode}". Order not found in database.`,
      };
    }

    if (targetOrder.status === 'REDEEMED') {
      const redeemedTime = new Date(targetOrder.redeemedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        success: false,
        message: `⚠️ ALREADY REDEEMED! This QR ticket was already used at ${redeemedTime} by ${targetOrder.redeemedByVendor || 'Vendor Counter'}.`,
        order: targetOrder,
      };
    }

    if (targetOrder.status === 'EXPIRED' || targetOrder.status === 'CANCELLED') {
      return {
        success: false,
        message: `⚠️ CANNOT REDEEM: Ticket status is ${targetOrder.status}.`,
        order: targetOrder,
      };
    }

    // Mark ticket as REDEEMED
    const redeemedAtIso = new Date().toISOString();
    const updatedOrder: Order = {
      ...targetOrder,
      status: 'REDEEMED',
      redeemedAt: redeemedAtIso,
      redeemedByVendor: currentUser.name || 'Vendor Counter 1',
    };

    setOrders(prev => {
      const exists = prev.some(o => o.ticketCode.toUpperCase() === updatedOrder.ticketCode.toUpperCase());
      if (exists) {
        return prev.map(o => o.ticketCode.toUpperCase() === updatedOrder.ticketCode.toUpperCase() ? updatedOrder : o);
      }
      return [updatedOrder, ...prev];
    });

    return {
      success: true,
      message: `🎉 TICKET VALIDATED & REDEEMED! Order #${targetOrder.ticketCode} for ${targetOrder.userName}. Food items approved for serving!`,
      order: updatedOrder,
    };
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.FOOD_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    setUsers(INITIAL_USERS);
    setFoodItems(INITIAL_FOOD_ITEMS);
    setOrders(INITIAL_ORDERS);
    setCurrentUserId(INITIAL_USERS[0].id);
    setCart([]);
    setActiveTicket(null);
    alert('All application state & dummy data restored to default!');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        switchUser,
        foodItems,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        toggleFoodAvailability,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        orders,
        createOrder,
        redeemOrder,
        activeTicket,
        setActiveTicket,
        theme,
        toggleTheme,
        isMobileFrame,
        setIsMobileFrame,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
