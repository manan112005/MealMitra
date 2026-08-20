import React from 'react';
import { useApp } from '../../context/AppContext';
import { Banknote, TrendingUp, Download, ArrowUpRight } from 'lucide-react';

export const AdminFinancials: React.FC = () => {
  const { orders } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const platformFee = totalRevenue * 0.15; // 15% platform fee
  const cookPayouts = totalRevenue * 0.70; // 70% to cooks
  const deliveryPayouts = totalRevenue * 0.15; // 15% to delivery

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c]">Financials & Payouts</h2>
          <p className="text-[#564337] mt-1">Platform revenue, commissions, and user payouts</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#dcc1b1] text-[#1a1c1c] font-semibold text-sm rounded-xl hover:bg-[#faf9f8] transition-colors shadow-2xs">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-indigo-700 p-5 rounded-2xl shadow-md text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Banknote className="w-24 h-24" />
          </div>
          <h3 className="font-semibold text-indigo-100 mb-4">Total Gross Volume</h3>
          <div className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-indigo-200 mt-2 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +15% vs last month
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs">
          <h3 className="font-semibold text-[#564337] mb-4">Platform Revenue (15%)</h3>
          <div className="text-3xl font-bold text-indigo-700">₹{platformFee.toLocaleString()}</div>
          <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% this week
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs">
          <h3 className="font-semibold text-[#564337] mb-4">Cook Payouts (70%)</h3>
          <div className="text-3xl font-bold text-green-700">₹{cookPayouts.toLocaleString()}</div>
          <p className="text-xs text-[#564337] mt-2 font-medium">
            Pending clearance: ₹1,240
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs">
          <h3 className="font-semibold text-[#564337] mb-4">Delivery Payouts (15%)</h3>
          <div className="text-3xl font-bold text-blue-700">₹{deliveryPayouts.toLocaleString()}</div>
          <p className="text-xs text-[#564337] mt-2 font-medium">
            Next payout on Friday
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 p-6 shadow-2xs text-center">
        <Banknote className="w-12 h-12 text-[#dcc1b1] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#1a1c1c] mb-1">Detailed Ledger</h3>
        <p className="text-sm text-[#564337] max-w-md mx-auto mb-4">
          The full financial ledger including transaction history, automated payouts, and tax deductions is available in the production environment.
        </p>
        <button className="px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors">
          View Documentation
        </button>
      </div>
    </div>
  );
};
