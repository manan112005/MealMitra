import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Banknote, TrendingUp, Download, ArrowUpRight, ChefHat, Bike, Receipt, CheckCircle, Clock } from 'lucide-react';
import { AvatarImage } from './AdminUsers';

export const AdminFinancials: React.FC = () => {
  const { orders, subscriptions, cooks } = useApp();
  const [activeLedgerTab, setActiveLedgerTab] = useState<'cooks' | 'delivery' | 'transactions'>('cooks');

  // Real unified financial computations
  const directOrdersRevenue = (orders || []).reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const subscriptionRevenue = (subscriptions || [])
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + (Number(s.planPrice) || Number(s.totalAmount) || 0), 0);
  
  const totalGrossVolume = directOrdersRevenue + subscriptionRevenue;
  const platformMargin = Math.round(totalGrossVolume * 0.10); // 10% platform fee
  const cookTotalPayout = Math.round(totalGrossVolume * 0.80); // 80% to kitchen partners
  const deliveryTotalPayout = Math.round(totalGrossVolume * 0.10); // 10% to fleet partners

  // Per cook earnings breakdown
  const cookPayoutList = cooks.map((c) => {
    const cookOrders = (orders || []).filter(o => o.cookName.toLowerCase() === c.name.toLowerCase());
    const cookSubs = (subscriptions || []).filter(s => s.cookName.toLowerCase() === c.name.toLowerCase() && s.status === 'Active');
    const orderSum = cookOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const subSum = cookSubs.reduce((sum, s) => sum + (Number(s.planPrice) || Number(s.totalAmount) || 0), 0);
    const gross = orderSum + subSum;
    const netPayout = Math.round(gross * 0.80);

    return {
      id: c.id,
      name: c.name,
      avatar: c.avatar,
      location: c.location,
      ordersCount: cookOrders.length,
      subsCount: cookSubs.length,
      grossRevenue: gross,
      netPayout,
      status: 'Ready for Settlement'
    };
  });

  // Delivery partner payouts breakdown
  const deliveryPayoutList = [
    {
      id: 'usr-del-lead',
      name: 'MANAN PATEL (Fleet Lead)',
      phone: '9825123456',
      totalDeliveries: (orders || []).filter(o => o.status === 'Delivered').length || 4,
      fuelAllowance: 250,
      baseFare: deliveryTotalPayout,
      totalEarnings: deliveryTotalPayout + 250,
      status: 'Auto-Transferred'
    }
  ];

  // Transaction Ledger items
  const transactionLedger = [
    ...(orders || []).map((o) => {
      const amt = Number(o.totalAmount) || 0;
      return {
        id: `TXN-ORD-${o.id}`,
        type: 'Direct Order',
        date: o.orderDate || o.orderTime || 'Today',
        customer: o.customerName,
        party: o.cookName,
        amount: amt,
        platformCut: Math.round(amt * 0.10),
        cookCut: Math.round(amt * 0.80),
        deliveryCut: Math.round(amt * 0.10),
        status: 'Settled'
      };
    }),
    ...(subscriptions || []).filter(s => s.status === 'Active').map((s) => {
      const amt = Number(s.planPrice) || Number(s.totalAmount) || 0;
      return {
        id: `TXN-SUB-${s.id}`,
        type: 'Subscription',
        date: s.startDate || 'This Month',
        customer: s.customerName,
        party: s.cookName,
        amount: amt,
        platformCut: Math.round(amt * 0.10),
        cookCut: Math.round(amt * 0.80),
        deliveryCut: Math.round(amt * 0.10),
        status: 'Settled'
      };
    })
  ];

  // CSV Export Handler
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Transaction ID,Type,Date,Customer,Provider,Amount (INR),Platform Fee (10%),Cook Share (80%),Delivery Share (10%),Status\n';

    transactionLedger.forEach(t => {
      csvContent += `"${t.id}","${t.type}","${t.date}","${t.customer}","${t.party}",${t.amount},${t.platformCut},${t.cookCut},${t.deliveryCut},"${t.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mealmitra_financial_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c]">Financials & Payouts</h2>
          <p className="text-[#564337] mt-1">Automated 10% platform revenue, cook disbursements & delivery earnings</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#944a00] text-white font-bold text-sm rounded-xl hover:bg-[#7a3d00] transition-colors shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export CSV Ledger
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1a1c1c] p-5 rounded-2xl shadow-md text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Banknote className="w-24 h-24" />
          </div>
          <h3 className="font-semibold text-stone-300 text-xs uppercase tracking-wider mb-2">Total Gross Volume (GMV)</h3>
          <div className="text-3xl font-extrabold">₹{totalGrossVolume.toLocaleString()}</div>
          <p className="text-xs text-amber-300 mt-2 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Direct + Subscriptions
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-xs">
          <h3 className="font-semibold text-[#564337] text-xs uppercase tracking-wider mb-2">Platform Revenue (10%)</h3>
          <div className="text-3xl font-extrabold text-[#944a00]">₹{platformMargin.toLocaleString()}</div>
          <p className="text-xs text-emerald-700 mt-2 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Net Company Margin
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-xs">
          <h3 className="font-semibold text-[#564337] text-xs uppercase tracking-wider mb-2">Cook Disbursements (80%)</h3>
          <div className="text-3xl font-extrabold text-[#006e2c]">₹{cookTotalPayout.toLocaleString()}</div>
          <p className="text-xs text-[#564337] mt-2 font-medium">
            Distributed to {cooks.length} Home Kitchens
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-xs">
          <h3 className="font-semibold text-[#564337] text-xs uppercase tracking-wider mb-2">Delivery Earnings (10%)</h3>
          <div className="text-3xl font-extrabold text-[#005cb8]">₹{deliveryTotalPayout.toLocaleString()}</div>
          <p className="text-xs text-[#564337] mt-2 font-medium">
            Dispatched to EV Route Fleet
          </p>
        </div>
      </div>

      {/* Detailed Ledger Section with Tabs */}
      <div className="space-y-4">
        <div className="flex bg-white p-1 rounded-xl border border-[#dcc1b1]/50 w-full sm:w-fit shadow-xs">
          <button
            onClick={() => setActiveLedgerTab('cooks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeLedgerTab === 'cooks' ? 'bg-[#006e2c] text-white shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" /> Cook Payouts
          </button>
          <button
            onClick={() => setActiveLedgerTab('delivery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeLedgerTab === 'delivery' ? 'bg-[#005cb8] text-white shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'
            }`}
          >
            <Bike className="w-3.5 h-3.5" /> Delivery Partner Payouts
          </button>
          <button
            onClick={() => setActiveLedgerTab('transactions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeLedgerTab === 'transactions' ? 'bg-[#944a00] text-white shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" /> Full Transaction Log
          </button>
        </div>

        {/* Cook Payouts Table */}
        {activeLedgerTab === 'cooks' && (
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 shadow-xs overflow-hidden">
            <div className="p-4 bg-[#faf9f8] border-b border-[#dcc1b1]/40 flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#1a1c1c]">Home Kitchen Payout Settlement (80% Revenue Share)</h3>
              <span className="text-xs font-semibold text-[#006e2c] bg-emerald-50 px-2.5 py-1 rounded-md">Automated Bi-Weekly Cycle</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#faf9f8] border-b border-[#dcc1b1]/30 text-xs font-bold text-[#564337] uppercase">
                    <th className="p-4">Cook Partner</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Volume (Orders / Subs)</th>
                    <th className="p-4">Gross Sales</th>
                    <th className="p-4">Net Payout (80%)</th>
                    <th className="p-4 text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dcc1b1]/20">
                  {cookPayoutList.map((cook) => (
                    <tr key={cook.id} className="hover:bg-[#faf9f8]/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <AvatarImage src={cook.avatar} name={cook.name} variant="cook" className="w-9 h-9" />
                          <div>
                            <p className="font-bold text-sm text-[#1a1c1c]">{cook.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-[#564337]">{cook.location}</td>
                      <td className="p-4 text-xs font-semibold text-[#1a1c1c]">
                        {cook.ordersCount} direct / {cook.subsCount} subs
                      </td>
                      <td className="p-4 text-sm font-semibold text-[#1a1c1c]">
                        ₹{cook.grossRevenue.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm font-extrabold text-[#006e2c]">
                        ₹{cook.netPayout.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                          <CheckCircle className="w-3 h-3" /> Ready
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delivery Partner Payouts Table */}
        {activeLedgerTab === 'delivery' && (
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 shadow-xs overflow-hidden">
            <div className="p-4 bg-[#faf9f8] border-b border-[#dcc1b1]/40 flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#1a1c1c]">Delivery Partner Disbursement (10% + Fuel Subsidy)</h3>
              <span className="text-xs font-semibold text-[#005cb8] bg-blue-50 px-2.5 py-1 rounded-md">Instant Daily UPI Payout</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#faf9f8] border-b border-[#dcc1b1]/30 text-xs font-bold text-[#564337] uppercase">
                    <th className="p-4">Delivery Partner</th>
                    <th className="p-4">Completed Deliveries</th>
                    <th className="p-4">Base Fare (10%)</th>
                    <th className="p-4">EV/Fuel Allowance</th>
                    <th className="p-4">Total Disbursement</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dcc1b1]/20">
                  {deliveryPayoutList.map((driver) => (
                    <tr key={driver.id} className="hover:bg-[#faf9f8]/50">
                      <td className="p-4">
                        <p className="font-bold text-sm text-[#1a1c1c]">{driver.name}</p>
                        <p className="text-xs text-[#564337]">{driver.phone}</p>
                      </td>
                      <td className="p-4 text-xs font-bold text-[#1a1c1c]">{driver.totalDeliveries} Deliveries</td>
                      <td className="p-4 text-sm font-semibold text-[#1a1c1c]">₹{driver.baseFare.toFixed(0)}</td>
                      <td className="p-4 text-sm font-semibold text-[#1a1c1c]">₹{driver.fuelAllowance}</td>
                      <td className="p-4 text-sm font-extrabold text-[#005cb8]">₹{(driver.totalEarnings).toFixed(0)}</td>
                      <td className="p-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                          <CheckCircle className="w-3 h-3" /> Auto-Transferred
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Full Transaction Log Table */}
        {activeLedgerTab === 'transactions' && (
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 shadow-xs overflow-hidden">
            <div className="p-4 bg-[#faf9f8] border-b border-[#dcc1b1]/40 flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#1a1c1c]">Live Transaction Stream</h3>
              <span className="text-xs font-semibold text-[#564337]">{transactionLedger.length} Records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#faf9f8] border-b border-[#dcc1b1]/30 text-xs font-bold text-[#564337] uppercase">
                    <th className="p-4">Txn Reference</th>
                    <th className="p-4">Channel</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Cook Partner</th>
                    <th className="p-4">Gross Total</th>
                    <th className="p-4">Platform (10%)</th>
                    <th className="p-4">Cook (80%)</th>
                    <th className="p-4">Delivery (10%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dcc1b1]/20">
                  {transactionLedger.map((txn) => (
                    <tr key={txn.id} className="hover:bg-[#faf9f8]/50">
                      <td className="p-4 text-xs font-bold text-[#1a1c1c]">{txn.id}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${txn.type === 'Subscription' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-[#1a1c1c]">{txn.customer}</td>
                      <td className="p-4 text-xs text-[#564337]">{txn.party}</td>
                      <td className="p-4 text-xs font-extrabold text-[#1a1c1c]">₹{txn.amount}</td>
                      <td className="p-4 text-xs font-bold text-[#944a00]">₹{txn.platformCut.toFixed(0)}</td>
                      <td className="p-4 text-xs font-bold text-[#006e2c]">₹{txn.cookCut.toFixed(0)}</td>
                      <td className="p-4 text-xs font-bold text-[#005cb8]">₹{txn.deliveryCut.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

