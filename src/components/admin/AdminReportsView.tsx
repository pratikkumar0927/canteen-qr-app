import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { OrderStatus } from '../../types';
import { Download, Printer } from 'lucide-react';

export const AdminReportsView: React.FC = () => {
  const { orders } = useApp();

  // Date filters
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30); // Default to last 30 days
    return d.toISOString().slice(0, 10);
  });

  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const [roleFilter, setRoleFilter] = useState<'all' | 'employee' | 'guest'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  // Filtered Orders Computation (Requirement #8: datewise for guest and employees)
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderTime = new Date(order.createdAt).getTime();
      const startMs = new Date(`${startDate}T00:00:00`).getTime();
      const endMs = new Date(`${endDate}T23:59:59.999`).getTime();
      
      const isDateValid = orderTime >= startMs && orderTime <= endMs;
      const isRoleValid = roleFilter === 'all' || order.userRole === roleFilter;
      const isStatusValid = statusFilter === 'all' || order.status === statusFilter;
      return isDateValid && isRoleValid && isStatusValid;
    });
  }, [orders, startDate, endDate, roleFilter, statusFilter]);

  // Aggregate Metrics
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = filteredOrders.length;
  const employeeOrders = filteredOrders.filter(o => o.userRole === 'employee');
  const guestOrders = filteredOrders.filter(o => o.userRole === 'guest');

  const employeeSpend = employeeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const guestSpend = guestOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Requirement #8 Export to CSV Function (Blob with UTF-8 BOM for Apple Numbers/Excel compatibility)
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No data available to export for the selected date range.');
      return;
    }

    const headers = [
      'Order ID',
      'Date',
      'Time',
      'User Name',
      'User Role',
      'Employee/Pass ID',
      'Ticket Code',
      'Items Breakdown',
      'Total Amount ($)',
      'Status',
      'Redeemed At',
      'Redeemed By Vendor'
    ];

    const rows = filteredOrders.map(order => {
      const dateObj = new Date(order.createdAt);
      const dateStr = dateObj.toLocaleDateString();
      const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const itemSummary = order.items.map(i => `${i.quantity}x ${i.name}`).join('; ');

      return [
        `"${order.id}"`,
        `"${dateStr}"`,
        `"${timeStr}"`,
        `"${order.userName}"`,
        `"${order.userRole.toUpperCase()}"`,
        `"${order.employeeId || 'GUEST'}"`,
        `"${order.ticketCode}"`,
        `"${itemSummary}"`,
        `"${order.totalAmount.toFixed(2)}"`,
        `"${order.status}"`,
        `"${order.redeemedAt ? new Date(order.redeemedAt).toLocaleString() : 'N/A'}"`,
        `"${order.redeemedByVendor || 'N/A'}"`
      ].join(',');
    });

    const csvString = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', blobUrl);
    link.setAttribute('download', `canteen_datewise_report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  // Requirement #8 Print View Trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="admin-report-container">
      
      {/* Header & Controls (Hidden when printing) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }} className="no-print">
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Datewise Sales & Redemption Analytics</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Audit food consumption history for Employees & Guests.
          </p>
        </div>

        {/* Action Buttons: Export & Print */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleExportCSV}
            style={{
              background: 'var(--accent-success)',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Download size={16} /> Export CSV
          </button>

          <button
            onClick={handlePrint}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* Printable Title Block (Only appears on window.print) */}
      <div style={{ display: 'none' }} className="print-only">
        <h1 style={{ fontSize: '18pt', marginBottom: '4pt' }}>ByteBite Canteen Audit Report</h1>
        <p style={{ fontSize: '10pt', color: '#666666', marginBottom: '12pt' }}>
          Date Range: {startDate} to {endDate} • Generated on: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Date & Role Filters Bar */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '14px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        alignItems: 'end'
      }} className="no-print">
        
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            User Role
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
          >
            <option value="all">All Roles (Employee & Guest)</option>
            <option value="employee">Employees Only</option>
            <option value="guest">Guests Only</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            Ticket Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="REDEEMED">Redeemed</option>
            <option value="ACTIVE">Active (Pending)</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Value</span>
          <h3 style={{ fontSize: '1.2rem', margin: '2px 0 0 0', color: 'var(--accent-primary)' }}>${totalRevenue.toFixed(2)}</h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{totalOrdersCount} orders</span>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Employee Spend</span>
          <h3 style={{ fontSize: '1.2rem', margin: '2px 0 0 0', color: '#2563eb' }}>${employeeSpend.toFixed(2)}</h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{employeeOrders.length} orders</span>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Guest Spend</span>
          <h3 style={{ fontSize: '1.2rem', margin: '2px 0 0 0', color: '#d97706' }}>${guestSpend.toFixed(2)}</h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{guestOrders.length} orders</span>
        </div>
      </div>

      {/* Datewise Data Table (Requirement #8) */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '10px 12px' }}>Date & Time</th>
                <th style={{ padding: '10px 12px' }}>Customer</th>
                <th style={{ padding: '10px 12px' }}>Role</th>
                <th style={{ padding: '10px 12px' }}>Ticket QR Code</th>
                <th style={{ padding: '10px 12px' }}>Items Ordered</th>
                <th style={{ padding: '10px 12px' }}>Total ($)</th>
                <th style={{ padding: '10px 12px' }}>Redemption Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const dateObj = new Date(order.createdAt);
                const isRedeemed = order.status === 'REDEEMED';

                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 600 }}>{dateObj.toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 700 }}>{order.userName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {order.employeeId || 'Guest Voucher'}
                      </div>
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <span className={`badge ${order.userRole === 'employee' ? 'badge-active' : 'badge-nonveg'}`}>
                        {order.userRole}
                      </span>
                    </td>

                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {order.ticketCode}
                    </td>

                    <td style={{ padding: '10px 12px', maxWidth: '200px' }}>
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>

                    <td style={{ padding: '10px 12px', fontWeight: 800 }}>
                      ${order.totalAmount.toFixed(2)}
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <span className={`badge ${isRedeemed ? 'badge-redeemed' : 'badge-active'}`}>
                        {isRedeemed ? 'REDEEMED' : 'ACTIVE'}
                      </span>
                      {isRedeemed && order.redeemedAt && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          At {new Date(order.redeemedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No order records found for the selected date range and role filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
