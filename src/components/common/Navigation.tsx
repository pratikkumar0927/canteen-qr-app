import React from 'react';
import { useApp } from '../../context/AppContext';
import { Utensils, Shield, ScanLine, Ticket } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, orders } = useApp();

  const activeOrdersCount = orders.filter(
    o => o.userId === currentUser.id && o.status === 'ACTIVE'
  ).length;

  return (
    <nav style={{
      position: 'sticky',
      bottom: 0,
      width: '100%',
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 90,
    }} className="no-print">
      {/* 1. Food Menu Tab */}
      <button
        onClick={() => setActiveTab('menu')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeTab === 'menu' ? 'var(--accent-primary)' : 'var(--text-muted)',
          fontSize: '0.75rem',
          fontWeight: activeTab === 'menu' ? 700 : 500,
        }}
      >
        <Utensils size={20} />
        Menu
      </button>

      {/* 2. My QR Tickets Tab */}
      {(currentUser.role === 'employee' || currentUser.role === 'guest') && (
        <button
          onClick={() => setActiveTab('tickets')}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            color: activeTab === 'tickets' ? 'var(--accent-primary)' : 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: activeTab === 'tickets' ? 700 : 500,
          }}
        >
          <Ticket size={20} />
          My QR Passes
          {activeOrdersCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-success)',
            }} />
          )}
        </button>
      )}

      {/* 3. Vendor QR Scanner Tab (Strictly for Vendor & Admin roles) */}
      {(currentUser.role === 'vendor' || currentUser.role === 'admin') && (
        <button
          onClick={() => setActiveTab('vendor')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            color: activeTab === 'vendor' ? 'var(--accent-primary)' : 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: activeTab === 'vendor' ? 700 : 500,
          }}
        >
          <ScanLine size={20} />
          QR Scanner
        </button>
      )}

      {/* 4. Admin Management Tab (Visible strictly to Admin role) */}
      {currentUser.role === 'admin' && (
        <button
          onClick={() => setActiveTab('admin')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            color: activeTab === 'admin' ? 'var(--accent-primary)' : 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: activeTab === 'admin' ? 700 : 500,
          }}
        >
          <Shield size={20} />
          Admin Hub
        </button>
      )}
    </nav>
  );
};
