import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Order } from '../../types';
import { X, CheckCircle2, AlertTriangle, Copy, ScanLine } from 'lucide-react';

interface TicketModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenVendorScanner?: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ order, onClose, onOpenVendorScanner }) => {
  if (!order) return null;

  const isRedeemed = order.status === 'REDEEMED';
  const isExpired = order.status === 'EXPIRED';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.ticketCode);
    alert(`Copied Ticket Code: ${order.ticketCode} to clipboard!`);
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
    }} className="no-print animate-fade-in">
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '380px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Modal Header */}
        <div style={{
          background: isRedeemed ? '#d1fae5' : isExpired ? '#fee2e2' : 'var(--wallet-bg)',
          color: isRedeemed ? '#065f46' : isExpired ? '#991b1b' : '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, opacity: 0.9 }}>
              Digital Food Pass
            </span>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
              {isRedeemed ? '✓ Ticket Redeemed' : isExpired ? '⚠️ Ticket Expired' : '🎫 Valid QR Ticket'}
            </h3>
          </div>

          <button onClick={onClose} style={{ color: 'inherit', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* QR Code Container & Single-Use Requirement #6 Badge */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          {/* Single-Use Warning Badge */}
          <div style={{
            background: isRedeemed ? 'var(--accent-success-light)' : 'var(--accent-warning-light)',
            color: isRedeemed ? '#065f46' : '#92400e',
            border: `1px solid ${isRedeemed ? '#10b981' : '#f59e0b'}`,
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {isRedeemed ? (
              <>
                <CheckCircle2 size={14} /> REDEEMED ONCE AT {new Date(order.redeemedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </>
            ) : (
              <>
                <AlertTriangle size={14} /> REDEEMABLE ONLY ONCE AT COUNTER
              </>
            )}
          </div>

          {/* Rendered QR Code */}
          <div style={{
            padding: '16px',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '16px',
            position: 'relative',
            opacity: isRedeemed ? 0.4 : 1,
            filter: isRedeemed ? 'grayscale(100%)' : 'none'
          }}>
            <QRCodeSVG
              value={order.ticketCode}
              size={180}
              level="H"
              includeMargin={true}
            />
            {isRedeemed && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                color: '#ef4444',
                fontSize: '1.4rem',
                transform: 'rotate(-15deg)',
                letterSpacing: '0.1em',
                border: '4px solid #ef4444',
                margin: '12px',
                borderRadius: '8px'
              }}>
                REDEEMED
              </div>
            )}
          </div>

          {/* Ticket Code String */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-tertiary)',
            padding: '6px 12px',
            borderRadius: '8px',
            marginBottom: '14px',
            cursor: 'pointer'
          }} onClick={handleCopyCode}>
            <span style={{ fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent-primary)' }}>
              {order.ticketCode}
            </span>
            <Copy size={14} color="var(--text-muted)" />
          </div>

          {/* Order Details Breakdown */}
          <div style={{
            width: '100%',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            textAlign: 'left',
            fontSize: '0.8rem',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--text-muted)' }}>
              <span>User: {order.userName} ({order.userRole})</span>
              <span>Total: ${order.totalAmount.toFixed(2)}</span>
            </div>

            <div style={{ fontWeight: 700, marginBottom: '6px' }}>Items ({order.items.length}):</div>
            <ul style={{ paddingLeft: '16px', margin: 0, color: 'var(--text-secondary)' }}>
              {order.items.map((it, idx) => (
                <li key={idx}>
                  {it.quantity}x {it.name} (${(it.price * it.quantity).toFixed(2)})
                </li>
              ))}
            </ul>
            {order.notes && (
              <div style={{ fontStyle: 'italic', marginTop: '6px', color: 'var(--text-muted)' }}>
                Note: {order.notes}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            {!isRedeemed && onOpenVendorScanner && (
              <button
                onClick={() => { onClose(); onOpenVendorScanner(); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-success)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ScanLine size={16} /> Test Scan at Vendor Counter
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Close Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
