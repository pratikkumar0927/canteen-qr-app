import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, ShoppingBag, Sun, Moon, Smartphone, QrCode, RefreshCw, LogOut } from 'lucide-react';

interface HeaderProps {
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onOpenWallet?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setActiveTab, onOpenCart, onOpenLogin, onOpenWallet }) => {
  const { currentUser, cart, theme, toggleTheme, isMobileFrame, setIsMobileFrame, resetAllData } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'employee':
        return <span style={{ background: '#dbeafe', color: '#1e40af' }} className="badge">Employee</span>;
      case 'guest':
        return <span style={{ background: '#fef3c7', color: '#92400e' }} className="badge">Guest</span>;
      case 'admin':
        return <span style={{ background: '#f3e8ff', color: '#6b21a8' }} className="badge">Admin</span>;
      case 'vendor':
        return <span style={{ background: '#d1fae5', color: '#065f46' }} className="badge">Vendor Scanner</span>;
      default:
        return null;
    }
  };

  return (
    <header style={{
      padding: '12px 16px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }} className="no-print">
      {/* Brand / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('menu')}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'var(--wallet-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <QrCode size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', margin: 0, lineHeight: 1.1 }}>ByteBite</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Mobile Canteen</p>
        </div>
      </div>

      {/* Wallet Balance Display for Employees (Requirement #4) */}
      {currentUser.role === 'employee' && (
        <div 
          onClick={onOpenWallet}
          style={{
            background: 'var(--accent-primary-light)',
            border: '1px solid var(--border-focus)',
            padding: '6px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          title="Click to view Wallet Statement & Balance"
        >
          <Wallet size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Wallet:</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            ${currentUser.walletBalance.toFixed(2)}
          </span>
        </div>
      )}

      {/* Free Guest Badge */}
      {currentUser.role === 'guest' && (
        <div style={{
          background: 'var(--accent-success-light)',
          border: '1px solid var(--accent-success)',
          padding: '4px 10px',
          borderRadius: '16px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#065f46',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          🎁 Free Guest Meal ($0)
        </div>
      )}

      {/* Header Actions & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Cart Icon (for Employee & Guest) */}
        {(currentUser.role === 'employee' || currentUser.role === 'guest') && (
          <button
            onClick={onOpenCart}
            style={{
              position: 'relative',
              padding: '8px',
              borderRadius: '10px',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)'
            }}
            aria-label="View Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--accent-danger)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </button>
        )}

        {/* User Persona & Role Selector button */}
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '20px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
          }}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ display: 'none', flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.75rem' }}>
            <span style={{ fontWeight: 600 }}>{currentUser.name.split(' ')[0]}</span>
          </div>
          {getRoleBadge(currentUser.role)}
        </button>
      </div>

      {/* Profile / Quick Role Switcher Dropdown */}
      {showProfileMenu && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '16px',
          width: '260px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          padding: '12px',
          zIndex: 200,
        }}>
          <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
            <p style={{ fontWeight: 700, margin: 0, fontSize: '0.9rem' }}>{currentUser.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{currentUser.email}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => { setShowProfileMenu(false); onOpenLogin(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--accent-danger)',
                background: 'var(--accent-danger-light)',
                fontWeight: 600
              }}
            >
              <LogOut size={16} /> Logout to Login Page
            </button>

            <button
              onClick={() => { toggleTheme(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
              }}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              Theme: {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>

            <button
              onClick={() => { setIsMobileFrame(!isMobileFrame); setShowProfileMenu(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
              }}
            >
              <Smartphone size={16} />
              {isMobileFrame ? 'Disable Mobile Frame' : 'Simulate Mobile View'}
            </button>

            <button
              onClick={() => { resetAllData(); setShowProfileMenu(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--accent-danger)',
              }}
            >
              <RefreshCw size={16} /> Reset All Dummy Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
