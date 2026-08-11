import React from 'react';
import type { FoodItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Plus, Minus, Flame, Clock, Leaf } from 'lucide-react';

interface FoodCardProps {
  item: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { cart, addToCart, updateCartQuantity } = useApp();

  const cartEntry = cart.find(ci => ci.item.id === item.id);
  const quantity = cartEntry ? cartEntry.quantity : 0;

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-sm)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
    }}>
      {/* Image & Badges Overlay */}
      <div style={{ position: 'relative', height: '140px', width: '100%', overflow: 'hidden' }}>
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: !item.isAvailable ? 'grayscale(80%)' : 'none',
          }}
        />

        {/* Veg/Non-Veg Badge */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
          <span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
            <Leaf size={12} /> {item.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>

        {/* Stock Status Badge */}
        {!item.isAvailable && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Sold Out
          </div>
        )}
      </div>

      {/* Item Information */}
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Flame size={12} color="var(--accent-warning)" /> {item.calories} kcal
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={12} /> {item.prepTime}
          </span>
        </div>

        <h3 style={{ fontSize: '1rem', marginBottom: '4px', lineHeight: 1.25 }}>{item.name}</h3>
        
        <p style={{
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          marginBottom: '12px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {item.description}
        </p>

        {/* Bottom Price & Add Control */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              ${item.price.toFixed(2)}
            </span>
          </div>

          {/* Add / Quantity Control */}
          {item.isAvailable && (
            <div>
              {quantity === 0 ? (
                <button
                  onClick={() => addToCart(item)}
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Plus size={16} /> Add
                </button>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--accent-primary-light)',
                  border: '1px solid var(--accent-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '4px 8px',
                }}>
                  <button
                    onClick={() => updateCartQuantity(item.id, -1)}
                    style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}
                  >
                    <Minus size={16} />
                  </button>

                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', minWidth: '16px', textAlign: 'center' }}>
                    {quantity}
                  </span>

                  <button
                    onClick={() => updateCartQuantity(item.id, 1)}
                    style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
