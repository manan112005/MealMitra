import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Download,
  Calendar,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

export const CookEarningsAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const dailyEarnings = [
    { day: 'Mon', revenue: 3200, meals: 22 },
    { day: 'Tue', revenue: 3600, meals: 24 },
    { day: 'Wed', revenue: 3900, meals: 26 },
    { day: 'Thu', revenue: 4100, meals: 28 },
    { day: 'Fri', revenue: 4400, meals: 30 },
    { day: 'Sat', revenue: 4800, meals: 32 },
    { day: 'Sun', revenue: 3840, meals: 26 },
  ];

  const recentPayouts = [
    {
      id: 'PAY-9041',
      date: 'Aug 18, 2026',
      amount: 24500,
      status: 'Deposited to HDFC Bank (**** 4821)',
      period: 'Aug 11 - Aug 17, 2026',
    },
    {
      id: 'PAY-8912',
      date: 'Aug 11, 2026',
      amount: 22800,
      status: 'Deposited to HDFC Bank (**** 4821)',
      period: 'Aug 04 - Aug 10, 2026',
    },
    {
      id: 'PAY-8780',
      date: 'Aug 04, 2026',
      amount: 21900,
      status: 'Deposited to HDFC Bank (**** 4821)',
      period: 'Jul 28 - Aug 03, 2026',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#944a00]" />
            <span>Earnings, Analytics & AI Forecast</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Track daily kitchen revenue, subscription settlements, and automated weekly bank payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 bg-white border border-[#dcc1b1] hover:bg-[#faf9f8] text-[#564337] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs">
            <Download className="w-3.5 h-3.5" />
            <span>Export GST Invoice</span>
          </button>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-2">
          <div className="text-xs font-bold text-[#564337]">This Week's Net Revenue</div>
          <div className="text-3xl font-black text-[#944a00]">₹27,840</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#51634c]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+16.4% higher than last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-2">
          <div className="text-xs font-bold text-[#564337]">Monthly Recurring Tiffins</div>
          <div className="text-3xl font-black text-[#51634c]">₹18,400</div>
          <div className="text-[11px] text-[#564337]">Guaranteed locked-in monthly subscriptions</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-2">
          <div className="text-xs font-bold text-[#564337]">Next Scheduled Payout</div>
          <div className="text-3xl font-black text-[#1a1c1c]">₹12,450</div>
          <div className="text-[11px] text-[#564337]">Auto-transfer on Monday morning</div>
        </div>
      </div>

      {/* Daily Revenue Chart Visualizer */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-[#1a1c1c] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#944a00]" />
              <span>Weekly Daily Performance Breakdown</span>
            </h3>
            <p className="text-xs text-[#564337]">Daily revenue vs meal count prepped</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-[#ffdcc5] text-[#944a00] rounded-full">
            Avg. ₹3,977 / Day
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4">
          {dailyEarnings.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="text-[11px] font-bold text-[#944a00]">₹{item.revenue}</div>
              <div className="w-full bg-[#faf9f8] h-36 rounded-xl border border-[#dcc1b1]/40 relative flex items-end p-1">
                <div
                  className="w-full bg-[#944a00] hover:bg-[#713700] rounded-lg transition-all"
                  style={{ height: `${(item.revenue / 5000) * 100}%` }}
                />
              </div>
              <div className="text-xs font-extrabold text-[#1a1c1c]">{item.day}</div>
              <div className="text-[10px] text-[#564337]">{item.meals} meals</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Smart Growth Insights */}
      <div className="bg-gradient-to-r from-white via-[#faf9f8] to-[#d1e6c9]/30 rounded-2xl border border-[#51634c]/40 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#51634c] text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1a1c1c]">AI Revenue Optimization Suggestions</h3>
            <p className="text-xs text-[#564337]">Machine-learned pricing & menu tips for your kitchen</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-[#dcc1b1]/40 space-y-1">
            <div className="font-bold text-[#944a00]">💡 Introduce Weekend Gujarati Farsan Box</div>
            <p className="text-[#564337] leading-relaxed">
              Customers in Bodakdev order 34% more snacks on Saturday evenings. Adding Dhokla/Handvo could boost weekend earnings by ₹2,400.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#dcc1b1]/40 space-y-1">
            <div className="font-bold text-[#51634c]">💡 Expand Dinner Capacity by 5 Meals</div>
            <p className="text-[#564337] leading-relaxed">
              Your dinner sold out by 6:45 PM for 4 consecutive days. Adding 5 more thalis has zero wasted inventory risk.
            </p>
          </div>
        </div>
      </div>

      {/* Payouts History */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
          Recent Direct Bank Payouts
        </h3>

        <div className="space-y-3">
          {recentPayouts.map((pay) => (
            <div
              key={pay.id}
              className="bg-white rounded-2xl border border-[#dcc1b1]/50 p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#1a1c1c]">{pay.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d1e6c9] text-[#51634c]">
                    ✓ Settled
                  </span>
                </div>
                <div className="text-xs text-[#564337]">
                  Period: <strong>{pay.period}</strong> • {pay.status}
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold text-[#51634c]">₹{pay.amount.toLocaleString()}</div>
                <div className="text-[11px] text-[#564337]">{pay.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
