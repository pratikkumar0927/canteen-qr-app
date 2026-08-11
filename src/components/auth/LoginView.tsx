import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import { ShieldCheck, QrCode, ArrowRight, Wallet, Ticket, CheckCircle2 } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { users, switchUser, currentUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');

  const filteredUsers = users.filter(u => u.role === selectedRole);

  const handleSelectUser = (userId: string) => {
    switchUser(userId);
    onLoginSuccess();
  };

  return (
    <div style={{
      padding: '24px 18px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '80vh',
      justifyContent: 'center',
    }} className="animate-fade-in">
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'var(--wallet-bg)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          marginBottom: '12px',
          boxShadow: 'var(--wallet-card-shadow)'
        }}>
          <QrCode size={36} />
        </div>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>Canteen QR Portal</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Mobile food ordering & single-use QR redemption system
        </p>
      </div>

      {/* Requirement 1: User Type Selector (3 main roles: Employee, Guest, Admin + Vendor) */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block' }}>
          1. Select User Type / Role
        </label>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
          {/* Employee Role */}
          <button
            onClick={() => setSelectedRole('employee')}
            style={{
              padding: '12px 8px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${selectedRole === 'employee' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              background: selectedRole === 'employee' ? 'var(--accent-primary-light)' : 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <Wallet size={22} color={selectedRole === 'employee' ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedRole === 'employee' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
              Employee
            </span>
          </button>

          {/* Guest Role */}
          <button
            onClick={() => setSelectedRole('guest')}
            style={{
              padding: '12px 8px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${selectedRole === 'guest' ? 'var(--accent-warning)' : 'var(--border-color)'}`,
              background: selectedRole === 'guest' ? 'var(--accent-warning-light)' : 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <Ticket size={22} color={selectedRole === 'guest' ? 'var(--accent-warning)' : 'var(--text-secondary)'} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedRole === 'guest' ? 'var(--accent-warning)' : 'var(--text-primary)' }}>
              Guest
            </span>
          </button>

          {/* Admin Role */}
          <button
            onClick={() => setSelectedRole('admin')}
            style={{
              padding: '12px 8px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${selectedRole === 'admin' ? '#7c3aed' : 'var(--border-color)'}`,
              background: selectedRole === 'admin' ? '#f3e8ff' : 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <ShieldCheck size={22} color={selectedRole === 'admin' ? '#7c3aed' : 'var(--text-secondary)'} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedRole === 'admin' ? '#7c3aed' : 'var(--text-primary)' }}>
              Admin
            </span>
          </button>
        </div>

        {/* Vendor Role (Extra button for testing redemption) */}
        <button
          onClick={() => setSelectedRole('vendor')}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            border: `1.5px dashed ${selectedRole === 'vendor' ? 'var(--accent-success)' : 'var(--border-color)'}`,
            background: selectedRole === 'vendor' ? 'var(--accent-success-light)' : 'var(--bg-card)',
            color: selectedRole === 'vendor' ? '#065f46' : 'var(--text-muted)',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <QrCode size={16} /> Login as Food Counter Vendor (Scanner)
        </button>
      </div>

      {/* Role Descriptions & Instructions */}
      <div style={{
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        marginBottom: '18px',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px'
      }}>
        {selectedRole === 'employee' && (
          <>
            <Wallet size={18} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong>Employee Mode:</strong> Pre-loaded wallet ($150.00). Browse menu, order food, auto-debit balance, and receive single-use QR ticket code.
            </div>
          </>
        )}
        {selectedRole === 'guest' && (
          <>
            <Ticket size={18} color="var(--accent-warning)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong>Guest Mode:</strong> Order food with visitor voucher pass. Generate single-use QR ticket code for food counter redemption.
            </div>
          </>
        )}
        {selectedRole === 'admin' && (
          <>
            <ShieldCheck size={18} color="#7c3aed" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong>Admin Mode:</strong> Add & manage food menu items, track datewise orders for guests/employees, export CSV, and print report.
            </div>
          </>
        )}
        {selectedRole === 'vendor' && (
          <>
            <QrCode size={18} color="var(--accent-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong>Vendor Mode:</strong> Food counter QR code validator. Camera scanner & single-use redemption checker.
            </div>
          </>
        )}
      </div>

      {/* User Persona Cards */}
      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block' }}>
        2. Tap Persona to Enter App
      </label>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredUsers.map(user => {
          const isCurrent = currentUser.id === user.id;

          return (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              style={{
                background: 'var(--bg-card)',
                border: `1.5px solid ${isCurrent ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: isCurrent ? 'var(--shadow-md)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '0.95rem', margin: 0 }}>{user.name}</h3>
                    {isCurrent && <CheckCircle2 size={16} color="var(--accent-primary)" />}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    {user.email}
                  </p>
                  
                  {user.role === 'employee' && (
                    <div style={{ marginTop: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      Pre-set Wallet: ${user.walletBalance.toFixed(2)} ({user.department})
                    </div>
                  )}
                  {user.role === 'guest' && (
                    <div style={{ marginTop: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-warning)' }}>
                      Pass Code: {user.guestPassCode}
                    </div>
                  )}
                </div>
              </div>

              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)'
              }}>
                <ArrowRight size={18} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
