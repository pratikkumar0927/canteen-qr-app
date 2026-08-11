import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminFoodManagement } from './AdminFoodManagement';
import { AdminReportsView } from './AdminReportsView';
import { Utensils, BarChart3, ShieldCheck, Lock } from 'lucide-react';

export const AdminHub: React.FC = () => {
  const { currentUser, users, switchUser } = useApp();
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'reports' | 'menu'>('reports');

  if (currentUser.role !== 'admin') {
    const adminUser = users.find(u => u.role === 'admin') || users[0];
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="animate-fade-in">
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--accent-danger-light)',
          color: 'var(--accent-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: '1.3rem', margin: '0 0 6px 0' }}>Admin Authorization Required</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '320px', margin: '0 0 20px 0' }}>
          Adding food items and inspecting datewise reports is restricted strictly to Admin accounts.
        </p>
        <button
          onClick={() => switchUser(adminUser.id)}
          style={{
            background: 'var(--accent-primary)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.85rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          Switch to Admin Account ({adminUser.name})
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
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
            Administrative Control Panel
          </span>
          <h2 style={{ fontSize: '1.25rem', margin: '2px 0 4px 0' }}>Canteen Management Hub</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: 0 }}>
            Manage menu items, track guest/employee orders datewise & export reports
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(6px)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <ShieldCheck size={24} />
          <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>Admin Access</div>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '8px',
        background: 'var(--bg-tertiary)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
      }} className="no-print">
        <button
          onClick={() => setActiveAdminSubTab('reports')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: activeAdminSubTab === 'reports' ? 700 : 500,
            background: activeAdminSubTab === 'reports' ? 'var(--bg-card)' : 'transparent',
            color: activeAdminSubTab === 'reports' ? 'var(--accent-primary)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: activeAdminSubTab === 'reports' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <BarChart3 size={18} /> Datewise Reports & Export
        </button>

        <button
          onClick={() => setActiveAdminSubTab('menu')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: activeAdminSubTab === 'menu' ? 700 : 500,
            background: activeAdminSubTab === 'menu' ? 'var(--bg-card)' : 'transparent',
            color: activeAdminSubTab === 'menu' ? 'var(--accent-primary)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: activeAdminSubTab === 'menu' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Utensils size={18} /> Add & Manage Food Items
        </button>
      </div>

      {/* Render selected view */}
      {activeAdminSubTab === 'reports' && <AdminReportsView />}
      {activeAdminSubTab === 'menu' && <AdminFoodManagement />}
    </div>
  );
};
