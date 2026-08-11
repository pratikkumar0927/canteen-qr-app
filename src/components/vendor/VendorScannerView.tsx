import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { Order } from '../../types';
import { ScanLine, CheckCircle2, XCircle, Camera, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Html5Qrcode } from 'html5-qrcode';

export const VendorScannerView: React.FC = () => {
  const { orders, redeemOrder, currentUser, users, switchUser } = useApp();
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; order?: Order } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Active tickets pending vendor redemption
  const activeOrders = orders.filter(o => o.status === 'ACTIVE');

  // Employee & Guest role guard
  if (currentUser.role === 'employee' || currentUser.role === 'guest') {
    const vendorUser = users.find(u => u.role === 'vendor') || users[0];
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="animate-fade-in">
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--accent-success-light)',
          color: 'var(--accent-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <ScanLine size={32} />
        </div>
        <h2 style={{ fontSize: '1.3rem', margin: '0 0 6px 0' }}>Food Counter Scanner Station</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '320px', margin: '0 0 20px 0' }}>
          The QR Scanner is used by Food Hall Vendors to scan customer tickets. As an <strong>{currentUser.role.toUpperCase()}</strong>, your QR code passes are stored under <strong>My QR Passes</strong>.
        </p>
        <button
          onClick={() => switchUser(vendorUser.id)}
          style={{
            background: 'var(--accent-success)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.85rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          Switch to Vendor Role ({vendorUser.name})
        </button>
      </div>
    );
  }

  // Handle barcode validation
  const handleValidate = (codeToScan: string) => {
    if (!codeToScan.trim()) return;

    const result = redeemOrder(codeToScan);
    setScanResult(result);

    if (result.success) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  // Start HTML5 Camera Scanner
  const startCamera = async () => {
    setIsCameraActive(true);
    setCameraError(null);

    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode('qr-reader');
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            handleValidate(decodedText);
            stopCamera();
          },
          () => {
            // scan failure callback (ignored during active scanning)
          }
        );
      } catch (err: any) {
        console.error('Camera Scanner Error:', err);
        setCameraError(err.message || 'Unable to access device camera. Please allow camera permissions or use manual code entry.');
        setIsCameraActive(false);
      }
    }, 300);
  };

  const stopCamera = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        console.error('Stop scanner error:', e);
      }
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
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
            Food Counter Countertop Scanner
          </span>
          <h2 style={{ fontSize: '1.25rem', margin: '2px 0 4px 0' }}>QR Redemption Station</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: 0 }}>
            Scan customer QR pass to validate & serve food
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(6px)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
        }}>
          <ScanLine size={24} />
          <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>Live Counter</div>
        </div>
      </div>

      {/* Camera Viewfinder Box */}
      <div style={{
        background: '#000000',
        borderRadius: 'var(--radius-xl)',
        minHeight: isCameraActive ? '280px' : '180px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div id="qr-reader" style={{ width: '100%' }} />

        {!isCameraActive && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#ffffff' }}>
            <Camera size={44} style={{ marginBottom: '10px', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1rem', margin: '0 0 4px 0', color: '#ffffff' }}>Camera Scanner Offline</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 14px 0' }}>
              Tap below to activate device camera or use instant 1-click test buttons.
            </p>
            <button
              onClick={startCamera}
              style={{
                background: 'var(--accent-success)',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Camera size={18} /> Turn On Camera Scanner
            </button>
          </div>
        )}

        {isCameraActive && (
          <button
            onClick={stopCamera}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(239, 68, 68, 0.85)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              zIndex: 10
            }}
          >
            Turn Off Camera
          </button>
        )}
      </div>

      {cameraError && (
        <div style={{ background: 'var(--accent-warning-light)', color: '#92400e', padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
          <strong>Camera Note:</strong> {cameraError}
        </div>
      )}

      {/* Quick 1-Click Demo Scanner (Allows testing without needing two screens!) */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="var(--accent-warning)" /> Instant Demo Validator (Active Passes)
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {activeOrders.length} Ready to Redeem
          </span>
        </div>

        {activeOrders.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            No active pending orders currently. Switch to Employee/Guest mode to place an order!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeOrders.map(ord => (
              <div
                key={ord.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-tertiary)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{ord.ticketCode} ({ord.userName})</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                </div>

                <button
                  onClick={() => handleValidate(ord.ticketCode)}
                  style={{
                    background: 'var(--accent-success)',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Scan & Redeem
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Manual Input Search */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Type ticket code manually (e.g. QR-EMP-2026-8812)..."
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)',
              fontSize: '0.85rem',
              color: 'var(--text-primary)'
            }}
          />

          <button
            onClick={() => { handleValidate(manualCode); setManualCode(''); }}
            style={{
              background: 'var(--accent-primary)',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            Validate
          </button>
        </div>
      </div>

      {/* Validation Result Box */}
      {scanResult && (
        <div style={{
          background: scanResult.success ? 'var(--accent-success-light)' : 'var(--accent-danger-light)',
          border: `2px solid ${scanResult.success ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }} className="animate-fade-in">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {scanResult.success ? (
              <CheckCircle2 size={28} color="var(--accent-success)" />
            ) : (
              <XCircle size={28} color="var(--accent-danger)" />
            )}
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0, color: scanResult.success ? '#065f46' : '#991b1b' }}>
                {scanResult.success ? '✓ Redemption Approved!' : '❌ Scan Rejected'}
              </h3>
              <p style={{ fontSize: '0.8rem', margin: 0, color: scanResult.success ? '#065f46' : '#991b1b' }}>
                {scanResult.message}
              </p>
            </div>
          </div>

          {/* Itemized serving list if valid */}
          {scanResult.order && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              fontSize: '0.8rem',
              color: '#0f172a'
            }}>
              <div style={{ fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Prepare & Serve Items ({scanResult.order.userName}):
              </div>
              <ul style={{ paddingLeft: '18px', margin: 0 }}>
                {scanResult.order.items.map((it, idx) => (
                  <li key={idx} style={{ margin: '2px 0' }}>
                    <strong>{it.quantity}x</strong> {it.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => setScanResult(null)}
            style={{
              alignSelf: 'flex-end',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: scanResult.success ? '#065f46' : '#991b1b',
              padding: '4px 8px'
            }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
