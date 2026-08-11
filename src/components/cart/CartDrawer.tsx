import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, Plus, Minus, Wallet, ArrowRight, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, currentUser, createOrder } = useApp();
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState(currentUser.guestPassCode || 'GUESTFREE');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isEmployee = currentUser.role === 'employee';
  const isGuest = currentUser.role === 'guest';
  const discountAmount = isGuest && isCouponApplied ? cartTotal : 0;
  const finalTotal = isEmployee ? cartTotal : (cartTotal - discountAmount);
  
  const remainingWalletBalance = isEmployee ? currentUser.walletBalance - cartTotal : 0;
  const isWalletSufficient = !isEmployee || remainingWalletBalance >= 0;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setIsCouponApplied(true);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    } catch (e) {
      // fallback
    }
  };

  const handleRemoveCoupon = () => {
    setIsCouponApplied(false);
  };

  const handleSubmitOrder = () => {
    if (cart.length === 0) return;
    if (!isWalletSufficient) {
      alert(`Insufficient Wallet Balance! Current balance is $${currentUser.walletBalance.toFixed(2)}, but order total is $${cartTotal.toFixed(2)}.`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const createdOrder = createOrder(notes);
      setIsSubmitting(false);

      if (createdOrder) {
        // Trigger festive confetti animation on successful order submission
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // fallback if canvas canvas-confetti unavailable
        }

        onClose();
        onOrderSuccess();
      }
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 500,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
    }} className="no-print">
      {/* Backdrop tap to dismiss */}
      <div style={{ flex: 1 }} onClick={onClose} />

      {/* Slide-Up Bottom Sheet Panel */}
      <div style={{
        background: 'var(--bg-card)',
        borderTopLeftRadius: 'var(--radius-xl)',
        borderTopRightRadius: 'var(--radius-xl)',
        padding: '20px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-xl)',
        borderTop: '1px solid var(--border-color)',
      }} className="animate-fade-in">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Your Order Cart</h2>
            <span style={{ fontSize: '0.8rem', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              {cart.reduce((sum, ci) => sum + ci.quantity, 0)} items
            </span>
          </div>

          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Your cart is empty.</p>
              <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}>Select food items from the menu to build your order.</p>
            </div>
          ) : (
            cart.map(({ item, quantity }) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--bg-tertiary)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                />

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.9rem', margin: 0 }}>{item.name}</h4>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    ${(item.price * quantity).toFixed(2)} (${item.price.toFixed(2)} ea)
                  </span>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => updateCartQuantity(item.id, -1)}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <Minus size={14} />
                  </button>

                  <span style={{ fontSize: '0.85rem', fontWeight: 800, minWidth: '18px', textAlign: 'center' }}>
                    {quantity}
                  </span>

                  <button
                    onClick={() => updateCartQuantity(item.id, 1)}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <Plus size={14} />
                  </button>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: 'var(--accent-danger)', marginLeft: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Special Instructions Note */}
            <div>
              <input
                type="text"
                placeholder="Add special instructions or dietary notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Wallet Calculation for Employee (Requirement #4 & #5) */}
            {isEmployee && (
              <div style={{
                background: isWalletSufficient ? 'var(--accent-primary-light)' : 'var(--accent-danger-light)',
                border: `1px solid ${isWalletSufficient ? 'var(--accent-primary)' : 'var(--accent-danger)'}`,
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wallet size={16} color={isWalletSufficient ? 'var(--accent-primary)' : 'var(--accent-danger)'} />
                  <span>Wallet Deduction:</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: isWalletSufficient ? 'var(--accent-primary)' : 'var(--accent-danger)' }}>
                    Remaining: ${remainingWalletBalance.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Current: ${currentUser.walletBalance.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Guest 100% OFF Coupon / Voucher Application Section */}
            {isGuest && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter Guest Voucher Code (e.g. GUESTFREE)..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isCouponApplied}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px dashed ${isCouponApplied ? 'var(--accent-success)' : '#f59e0b'}`,
                      background: isCouponApplied ? 'var(--accent-success-light)' : 'var(--bg-tertiary)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: isCouponApplied ? '#065f46' : 'var(--text-primary)',
                      textTransform: 'uppercase'
                    }}
                  />

                  {!isCouponApplied ? (
                    <button
                      onClick={handleApplyCoupon}
                      style={{
                        background: 'var(--accent-warning)',
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Tag size={16} /> Apply Coupon
                    </button>
                  ) : (
                    <button
                      onClick={handleRemoveCoupon}
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--accent-danger)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {isCouponApplied ? (
                  <div style={{
                    background: 'var(--accent-success-light)',
                    border: '1px solid var(--accent-success)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    color: '#065f46',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: 700
                  }}>
                    <span>🎉 Guest Voucher Applied (100% Discount)</span>
                    <span style={{ fontSize: '0.9rem' }}>-${cartTotal.toFixed(2)}</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    💡 Tap "Apply Coupon" to get food 100% Free of Cost!
                  </div>
                )}
              </div>
            )}

            {/* Total Summary */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Amount</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: isGuest && isCouponApplied ? 'var(--accent-success)' : 'var(--accent-primary)' }}>
                  ${finalTotal.toFixed(2)}
                </span>
                {isGuest && isCouponApplied && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-success)', fontWeight: 800, display: 'block' }}>
                    100% FREE OF COST
                  </span>
                )}
              </div>
            </div>

            {/* Submit Order & Generate Single-Use QR Button (Requirements #5 & #6) */}
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || !isWalletSufficient}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: isWalletSufficient ? 'var(--wallet-bg)' : 'var(--text-muted)',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isWalletSufficient ? 'var(--wallet-card-shadow)' : 'none',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                'Generating QR Code Ticket...'
              ) : (
                <>
                  Submit Order & Get QR Code <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
