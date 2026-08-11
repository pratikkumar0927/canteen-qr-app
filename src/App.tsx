import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { FoodMenu } from './components/menu/FoodMenu';
import { MyTicketsView } from './components/tickets/MyTicketsView';
import { VendorScannerView } from './components/vendor/VendorScannerView';
import { AdminHub } from './components/admin/AdminHub';
import { CartDrawer } from './components/cart/CartDrawer';
import { TicketModal } from './components/tickets/TicketModal';
import { WalletModal } from './components/wallet/WalletModal';
import { GuestVoucherModal } from './components/guest/GuestVoucherModal';
import { LoginView } from './components/auth/LoginView';
import type { Order } from './types';

const MainContent: React.FC = () => {
  const { isMobileFrame, activeTicket, setActiveTicket, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<string>('menu');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isGuestVoucherOpen, setIsGuestVoucherOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedTicketModal, setSelectedTicketModal] = useState<Order | null>(null);

  // Automatic Fail-Safe Guard: Non-admin users are automatically redirected to Menu if on Admin tab!
  React.useEffect(() => {
    if (currentUser.role !== 'admin' && activeTab === 'admin') {
      setActiveTab('menu');
    }
  }, [currentUser, activeTab]);

  const activeTicketToDisplay = activeTicket || selectedTicketModal;

  return (
    <div className={isMobileFrame ? 'desktop-wrapper' : ''}>
      <div className={`full-mobile-app ${isMobileFrame ? 'mobile-frame-container' : 'responsive-desktop'}`}>
        
        {/* Mobile Notch Simulation */}
        {isMobileFrame && (
          <div className="mobile-notch">
            <div className="mobile-notch-camera" />
          </div>
        )}

        {/* Top Header Navigation */}
        <Header
          setActiveTab={setActiveTab}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenLogin={() => {
            setActiveTab('menu');
            setIsLoginOpen(true);
          }}
          onOpenWallet={() => setIsWalletOpen(true)}
        />

        {/* Scrollable View Content */}
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
          {isLoginOpen ? (
            <LoginView onLoginSuccess={() => {
              setActiveTab('menu');
              setIsLoginOpen(false);
            }} />
          ) : (
            <>
              {activeTab === 'menu' && <FoodMenu />}
              {activeTab === 'tickets' && (
                <MyTicketsView onSelectOrder={(ord) => setSelectedTicketModal(ord)} />
              )}
              {activeTab === 'vendor' && <VendorScannerView />}
              {activeTab === 'admin' && <AdminHub />}
            </>
          )}
        </main>

        {/* Bottom Tab Navigation Bar */}
        {!isLoginOpen && (
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {/* Cart Drawer Bottom Sheet (Requirement #5) */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onOrderSuccess={() => setActiveTab('tickets')}
        />

        {/* QR Code Ticket Pass Modal (Requirement #6) */}
        <TicketModal
          order={activeTicketToDisplay}
          onClose={() => {
            setActiveTicket(null);
            setSelectedTicketModal(null);
          }}
        />

        {/* Employee Wallet Statement Modal (Requirement #4) */}
        <WalletModal
          isOpen={isWalletOpen}
          onClose={() => setIsWalletOpen(false)}
        />

        {/* Guest Voucher Pass Modal */}
        <GuestVoucherModal
          isOpen={isGuestVoucherOpen}
          onClose={() => setIsGuestVoucherOpen(false)}
          onStartOrder={() => setActiveTab('menu')}
        />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
