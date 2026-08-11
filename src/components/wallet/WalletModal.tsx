import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowDownRight, ArrowUpRight, History } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, orders } = useApp();

  if (!isOpen || currentUser.role !== 'employee') return null;

  // Filter employee's orders to show wallet transaction history
  const employeeOrders = orders.filter(o => o.userId === currentUser.id);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
    }} className="no-print animate-fade-in" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '400px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Wallet Header Banner */}
        <div style={{
          background: 'var(--wallet-bg)',
          color: '#ffffff',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
            Employee Allowance Wallet
          </span>
          
          <div style={{ fontSize: '2rem', fontWeight: 800, margin: '6px 0 2px 0' }}>
            ${currentUser.walletBalance.toFixed(2)}
          </div>

          <div style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{currentUser.name} ({currentUser.employeeId || 'EMP-1042'})</span>
            <span>•</span>
            <span>{currentUser.department || 'Engineering'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '60vh', overflowY: 'auto' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={16} color="var(--accent-primary)" /> Wallet Statement & Transactions
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {employeeOrders.length} Activity Log(s)
            </span>
          </div>

          {/* Pre-set Value Notice (Requirement #4) */}
          <div style={{
            background: 'var(--accent-primary-light)',
            border: '1px solid var(--border-focus)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)'
          }}>
            <strong>Pre-Set Allowance:</strong> Your wallet is credited monthly with corporate dining funds. Balances auto-debit upon submitting canteen food orders.
          </div>

          {/* Transaction Activity List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Initial Pre-set Credit Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-tertiary)',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--accent-success-light)',
                  color: 'var(--accent-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowDownRight size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>Pre-Set Monthly Allowance</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Corporate Dining Credit</div>
                </div>
              </div>

              <div style={{ fontWeight: 800, color: 'var(--accent-success)' }}>
                +$150.00
              </div>
            </div>

            {/* Spent Order Transactions */}
            {employeeOrders.map(ord => (
              <div
                key={ord.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-tertiary)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--accent-danger-light)',
                    color: 'var(--accent-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ArrowUpRight size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>Food Order #{ord.ticketCode}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {ord.items.map(i => i.name).join(', ')}
                    </div>
                  </div>
                </div>

                <div style={{ fontWeight: 800, color: 'var(--accent-danger)' }}>
                  -${ord.totalAmount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              marginTop: '4px'
            }}
          >
            Close Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
