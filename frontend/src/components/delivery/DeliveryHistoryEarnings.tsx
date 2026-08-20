import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_DELIVERY_PARTNER_STATE } from '../../data/mockData';
import {
  Wallet,
  History,
  Award,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle,
  Star,
  ShieldCheck,
  Bike,
} from 'lucide-react';

interface Props {
  defaultTab?: 'history' | 'earnings' | 'performance';
}

export const DeliveryHistoryEarnings: React.FC<Props> = ({ defaultTab = 'earnings' }) => {
  const { deliveryPartnerState } = useApp();
  const partner = deliveryPartnerState || MOCK_DELIVERY_PARTNER_STATE;
  const [activeTab, setActiveTab] = useState<'earnings' | 'history' | 'performance'>(defaultTab);

  const pastTrips = [
    {
      id: 'TRIP-8921',
      date: 'Today, 12:45 PM',
      cluster: 'Bodakdev Cluster #4 (3 Tiffins)',
      distanceKm: 4.8,
      durationMins: 24,
      amount: 140,
      breakdown: 'Base ₹80 + Cluster Bonus ₹40 + Tip ₹20',
      status: 'Completed',
    },
    {
      id: 'TRIP-8890',
      date: 'Yesterday, 8:15 PM',
      cluster: 'Satellite Evening Cluster (4 Tiffins)',
      distanceKm: 6.2,
      durationMins: 32,
      amount: 195,
      breakdown: 'Base ₹110 + Cluster Bonus ₹55 + Tip ₹30',
      status: 'Completed',
    },
    {
      id: 'TRIP-8845',
      date: 'Yesterday, 1:10 PM',
      cluster: 'Navrangpura Office Cluster (5 Tiffins)',
      distanceKm: 7.1,
      durationMins: 35,
      amount: 240,
      breakdown: 'Base ₹140 + Cluster Bonus ₹70 + Tip ₹30',
      status: 'Completed',
    },
    {
      id: 'TRIP-8812',
      date: 'Aug 18, 2026',
      cluster: 'Vastrapur Lunch Cluster (3 Tiffins)',
      distanceKm: 4.2,
      durationMins: 20,
      amount: 130,
      breakdown: 'Base ₹80 + Cluster Bonus ₹40 + Tip ₹10',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#4e6074]" />
            <span>Delivery Partner Earnings & Performance</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Track trip payouts, cluster batch incentives, and performance ratings.
          </p>
        </div>

        <div className="p-1 bg-white border border-[#dcc1b1]/60 rounded-xl flex gap-1 self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'earnings'
                ? 'bg-[#4e6074] text-white shadow-2xs'
                : 'text-[#564337] hover:text-[#1a1c1c]'
            }`}
          >
            Earnings
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-[#4e6074] text-white shadow-2xs'
                : 'text-[#564337] hover:text-[#1a1c1c]'
            }`}
          >
            Trips ({pastTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'performance'
                ? 'bg-[#4e6074] text-white shadow-2xs'
                : 'text-[#564337] hover:text-[#1a1c1c]'
            }`}
          >
            Performance
          </button>
        </div>
      </div>

      {activeTab === 'earnings' && (
        <div className="space-y-6">
          {/* Top Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-[#564337]">Today's Earnings</div>
              <div className="text-3xl font-black text-[#51634c]">₹{partner.todayEarnings}</div>
              <div className="text-[11px] text-[#564337]">14 deliveries completed today</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-[#564337]">Weekly Earnings</div>
              <div className="text-3xl font-black text-[#4e6074]">₹5,820</div>
              <div className="text-[11px] text-[#51634c] font-bold">+₹750 Cluster Batch Bonuses</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-[#564337]">Monthly Total</div>
              <div className="text-3xl font-black text-[#1a1c1c]">₹24,650</div>
              <div className="text-[11px] text-[#564337]">Direct transfer to bank account</div>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#1a1c1c]">Partner Compensation Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#564337]">Base Delivery Fee:</span>
                  <span className="font-bold text-[#1a1c1c]">₹35 per drop</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#564337]">Cluster Batch Multiplier:</span>
                  <span className="font-bold text-[#51634c]">+₹15 extra / additional drop</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#564337]">Distance Allowance:</span>
                  <span className="font-bold text-[#1a1c1c]">₹6 / km after 3 km</span>
                </div>
              </div>

              <div className="p-4 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#564337]">Customer Tips:</span>
                  <span className="font-bold text-[#51634c]">100% credited to partner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#564337]">Weekly Target Incentive:</span>
                  <span className="font-bold text-[#944a00]">₹500 bonus for 50+ drops</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#564337]">Daily Thermal Box Allowance:</span>
                  <span className="font-bold text-[#1a1c1c]">₹20 / shift</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
            Recent Cluster Trip History
          </h3>

          <div className="space-y-3">
            {pastTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-[#dcc1b1]/50 p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#1a1c1c]">{trip.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d1e6c9] text-[#51634c]">
                      ✓ {trip.status}
                    </span>
                    <span className="text-xs text-[#564337]">{trip.date}</span>
                  </div>

                  <div className="text-xs font-semibold text-[#1a1c1c]">{trip.cluster}</div>
                  <div className="text-[11px] text-[#564337]">
                    {trip.distanceKm} km • {trip.durationMins} mins • {trip.breakdown}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-[#51634c]">₹{trip.amount}</div>
                  <span className="text-[10px] text-[#564337]">Settled to wallet</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-[#564337]">Customer Rating</div>
              <div className="text-3xl font-black text-[#944a00] flex items-center gap-1">
                <Star className="w-6 h-6 fill-[#e67e22] text-[#e67e22]" />
                <span>4.8 / 5.0</span>
              </div>
              <div className="text-[11px] text-[#564337]">Based on 340 customer ratings</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-[#564337]">On-Time Delivery SLA</div>
              <div className="text-3xl font-black text-[#51634c]">99.2%</div>
              <div className="text-[11px] text-[#51634c] font-bold">Top 5% Partner in Ahmedabad</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-[#564337]">Zero Spill Guarantee</div>
              <div className="text-3xl font-black text-[#4e6074]">100%</div>
              <div className="text-[11px] text-[#564337]">Insulated thermal bag audit passed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
