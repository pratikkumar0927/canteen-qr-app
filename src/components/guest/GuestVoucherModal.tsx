import React from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, Copy, Sparkles } from 'lucide-react';

interface GuestVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOrder: () => void;
}

export const GuestVoucherModal: React.FC<GuestVoucherModalProps> = ({ isOpen, onClose, onStartOrder }) => {
  const { currentUser } = useApp();

  if (!isOpen || currentUser.role !== 'guest') return null;

  const handleCopyPass = () => {
    if (currentUser.guestPassCode) {
      navigator.clipboard.writeText(currentUser.guestPassCode);
      alert(`Copied Guest Pass Code: ${currentUser.guestPassCode}`);
    }
  };

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
          maxWidth: '380px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Guest Voucher Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
            Visitor Meal Pass
          </span>

          <div style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 2px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={24} /> Guest Dining Voucher
          </div>

          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            Issued to: {currentUser.name}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
          
          <div style={{
            background: 'var(--accent-warning-light)',
            border: '1px dashed #f59e0b',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
              Voucher Pass Code
            </span>
            <div
              onClick={handleCopyPass}
              style={{
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#92400e',
                background: 'rgba(255, 255, 255, 0.6)',
                padding: '6px 14px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              {currentUser.guestPassCode || 'GST-PASS-9901'}
              <Copy size={14} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#92400e' }}>
              ✓ Status: Authorized Corporate Visitor Pass
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'left', lineHeight: 1.4 }}>
            <strong>How to use your Guest Voucher:</strong>
            <ol style={{ paddingLeft: '18px', marginTop: '4px' }}>
              <li>Select food items from the canteen menu.</li>
              <li>Submit your order to generate your single-use QR Code.</li>
              <li>Present the QR Code to the food counter vendor to collect your food.</li>
            </ol>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { onClose(); onStartOrder(); }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-warning)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={16} /> Browse Menu & Order
            </button>

            <button
              onClick={onClose}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
