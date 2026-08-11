import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, QrCode, ChevronRight } from 'lucide-react';
import type { Order } from '../../types';

interface MyTicketsViewProps {
  onSelectOrder: (order: Order) => void;
}

export const MyTicketsView: React.FC<MyTicketsViewProps> = ({ onSelectOrder }) => {
  const { orders, currentUser } = useApp();
  const [filter, setFilter] = useState<'all' | 'ACTIVE' | 'REDEEMED'>('all');

  const myOrders = orders.filter(o => o.userId === currentUser.id);

  const filteredOrders = myOrders.filter(o => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '1.3rem', margin: 0 }}>My Food QR Passes</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
          Present your QR code ticket at the food counter for redemption.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: filter === 'all' ? 700 : 500,
            background: filter === 'all' ? 'var(--bg-card)' : 'transparent',
            color: filter === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
            boxShadow: filter === 'all' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          All ({myOrders.length})
        </button>

        <button
          onClick={() => setFilter('ACTIVE')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: filter === 'ACTIVE' ? 700 : 500,
            background: filter === 'ACTIVE' ? 'var(--bg-card)' : 'transparent',
            color: filter === 'ACTIVE' ? 'var(--accent-primary)' : 'var(--text-muted)',
            boxShadow: filter === 'ACTIVE' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          Active Passes ({myOrders.filter(o => o.status === 'ACTIVE').length})
        </button>

        <button
          onClick={() => setFilter('REDEEMED')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: filter === 'REDEEMED' ? 700 : 500,
            background: filter === 'REDEEMED' ? 'var(--bg-card)' : 'transparent',
            color: filter === 'REDEEMED' ? 'var(--accent-success)' : 'var(--text-muted)',
            boxShadow: filter === 'REDEEMED' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          Redeemed ({myOrders.filter(o => o.status === 'REDEEMED').length})
        </button>
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredOrders.map(order => {
          const isRedeemed = order.status === 'REDEEMED';
          const orderDate = new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

          return (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: `1.5px solid ${isRedeemed ? 'var(--border-color)' : 'var(--accent-primary)'}`,
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: isRedeemed ? 'none' : 'var(--shadow-md)',
                opacity: isRedeemed ? 0.75 : 1,
                transition: 'transform 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: isRedeemed ? 'var(--accent-success-light)' : 'var(--accent-primary-light)',
                  color: isRedeemed ? 'var(--accent-success)' : 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <QrCode size={24} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {order.ticketCode}
                    </span>
                    <span className={`badge ${isRedeemed ? 'badge-redeemed' : 'badge-active'}`}>
                      {isRedeemed ? 'REDEEMED' : 'VALID ONCE'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Placed on {orderDate} • Total: ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div style={{ color: 'var(--text-muted)' }}>
                <ChevronRight size={20} />
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-muted)'
          }}>
            <Ticket size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No passes found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
