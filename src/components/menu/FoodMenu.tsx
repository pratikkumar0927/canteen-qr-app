import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodCard } from './FoodCard';
import type { FoodCategory } from '../../types';
import { Search, Leaf, AlertCircle } from 'lucide-react';

export const FoodMenu: React.FC = () => {
  const { foodItems, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);

  const categories: { id: FoodCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Items', icon: '🍽️' },
    { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { id: 'lunch', label: 'Lunch', icon: '🥗' },
    { id: 'snacks', label: 'Snacks', icon: '🍟' },
    { id: 'beverages', label: 'Beverages', icon: '☕' },
  ];

  const filteredItems = useMemo(() => {
    return foodItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !isVegOnly || item.isVeg;
      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [foodItems, selectedCategory, searchQuery, isVegOnly]);

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
      {/* Role Banner */}
      <div style={{
        background: currentUser.role === 'employee' ? 'var(--wallet-bg)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
            Welcome back 👋
          </span>
          <h2 style={{ fontSize: '1.25rem', margin: '2px 0 4px 0' }}>{currentUser.name}</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: 0 }}>
            {currentUser.role === 'employee'
              ? `Department: ${currentUser.department || 'Corporate Staff'}`
              : `Guest Voucher Pass #${currentUser.guestPassCode}`}
          </p>
        </div>

        {/* Pre-set Wallet Card for Employee (Requirement #4) */}
        {currentUser.role === 'employee' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'right',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.9 }}>Wallet Credit</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>${currentUser.walletBalance.toFixed(2)}</div>
          </div>
        )}

        {currentUser.role === 'guest' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(8px)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>FREE ($0.00)</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>Complimentary Meal</div>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search delicious food & drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              width: '100%',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Veg Only Toggle Pill */}
        <button
          onClick={() => setIsVegOnly(!isVegOnly)}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: isVegOnly ? '#d1fae5' : 'var(--bg-card)',
            color: isVegOnly ? '#065f46' : 'var(--text-secondary)',
            border: `1px solid ${isVegOnly ? '#10b981' : 'var(--border-color)'}`,
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Leaf size={16} color={isVegOnly ? '#065f46' : 'var(--text-muted)'} />
          Veg
        </button>
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none',
      }}>
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                whiteSpace: 'nowrap',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 700 : 500,
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                boxShadow: isSelected ? '0 4px 10px rgba(99, 102, 241, 0.25)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.icon} {cat.label}
            </button>
          );
        })}
      </div>

      {/* Food Items Catalog (Requirement #3) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
        gap: '14px',
        marginBottom: '40px'
      }}>
        {filteredItems.map(item => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-muted)'
        }}>
          <AlertCircle size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontWeight: 600 }}>No food items matched your search.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setIsVegOnly(false); }}
            style={{ marginTop: '10px', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700 }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
