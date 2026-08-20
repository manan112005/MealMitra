import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Repeat,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Phone,
  Building,
  Home,
} from 'lucide-react';

export const CookSubscribers: React.FC = () => {
  const { currentCookProfile } = useApp();

  const subscribers = [
    {
      id: 'sub-1',
      customerName: 'Jay Shah',
      phone: '+91 99250 12345',
      plan: 'Lunch + Dinner Daily',
      period: 'Monthly',
      startDate: 'Aug 1, 2026',
      renewalDate: 'Aug 31, 2026',
      lunchDrop: 'Office: Mondeal Square, Prahlad Nagar (1:00 PM)',
      dinnerDrop: 'Home: Shivalik Heights, Bodakdev (8:00 PM)',
      dietaryNotes: 'Medium spice, extra soft rotis, no garlic on Tuesdays',
      status: 'Active',
      mealsRemaining: 18,
    },
    {
      id: 'sub-2',
      customerName: 'Priya Mehta',
      phone: '+91 98980 54321',
      plan: 'Lunch Only Thali',
      period: 'Monthly',
      startDate: 'Aug 5, 2026',
      renewalDate: 'Sep 5, 2026',
      lunchDrop: 'Office: Titanium City Center, Satellite (1:15 PM)',
      dinnerDrop: 'N/A',
      dietaryNotes: 'Pure Jain (No onion, garlic, potatoes)',
      status: 'Active',
      mealsRemaining: 22,
    },
    {
      id: 'sub-3',
      customerName: 'Aarav Sharma',
      phone: '+91 97123 98765',
      plan: 'Lunch + Dinner Daily',
      period: 'Yearly',
      startDate: 'Jan 10, 2026',
      renewalDate: 'Jan 10, 2027',
      lunchDrop: 'Office: Iscon Elegance, SG Highway (1:00 PM)',
      dinnerDrop: 'Home: Orchid Whitefield, Makarba (8:15 PM)',
      dietaryNotes: 'High protein vegetarian, prefers extra dal bowl',
      status: 'Active',
      mealsRemaining: 142,
    },
    {
      id: 'sub-4',
      customerName: 'Meera Trivedi',
      phone: '+91 98240 11223',
      plan: 'Dinner Only Comfort',
      period: 'Monthly',
      startDate: 'Aug 10, 2026',
      renewalDate: 'Sep 10, 2026',
      lunchDrop: 'N/A',
      dinnerDrop: 'Home: Goyal Intercity, Drive-In Rd (7:45 PM)',
      dietaryNotes: 'Low oil, low salt (Doctor recommended)',
      status: 'Active',
      mealsRemaining: 20,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#944a00]" />
            <span>Active Tiffin Subscribers ({subscribers.length + 14})</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            View recurring customer meal schedules, configured dual addresses, and custom dietary instructions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#d1e6c9] text-[#51634c]">
            ● 100% On-Time Fulfillments
          </span>
        </div>
      </div>

      {/* Subscriber Cards List */}
      <div className="grid grid-cols-1 gap-5">
        {subscribers.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs space-y-4 hover:shadow-xs transition-all"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-[#eeeeed]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffdcc5] text-[#944a00] flex items-center justify-center font-extrabold text-xs">
                  {sub.customerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-[#1a1c1c]">{sub.customerName}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d1e6c9] text-[#51634c]">
                      ● {sub.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#564337] flex items-center gap-2 mt-0.5">
                    <a href={`tel:${sub.phone}`} className="flex items-center gap-1 hover:underline">
                      <Phone className="w-3 h-3 text-[#564337]" />
                      <span>{sub.phone}</span>
                    </a>
                    <span>•</span>
                    <span>Started: {sub.startDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[11px] text-[#564337]">Plan Tier</div>
                  <div className="font-extrabold text-xs text-[#944a00]">{sub.plan} ({sub.period})</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-[#564337]">Remaining</div>
                  <div className="font-extrabold text-xs text-[#51634c]">{sub.mealsRemaining} Meals</div>
                </div>
              </div>
            </div>

            {/* Configured Addresses & Dietary Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 bg-[#faf9f8] p-3.5 rounded-xl border border-[#dcc1b1]/40">
                <div className="font-bold text-[#1a1c1c] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#944a00]" />
                  <span>Dual Delivery Routing Details</span>
                </div>
                {sub.lunchDrop !== 'N/A' && (
                  <div className="flex items-start gap-1.5 text-[#564337]">
                    <Building className="w-3.5 h-3.5 text-[#944a00] shrink-0 mt-0.5" />
                    <span>{sub.lunchDrop}</span>
                  </div>
                )}
                {sub.dinnerDrop !== 'N/A' && (
                  <div className="flex items-start gap-1.5 text-[#564337]">
                    <Home className="w-3.5 h-3.5 text-[#51634c] shrink-0 mt-0.5" />
                    <span>{sub.dinnerDrop}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 bg-[#faf9f8] p-3.5 rounded-xl border border-[#dcc1b1]/40">
                <div className="font-bold text-[#1a1c1c] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#944a00]" />
                  <span>Customer Specific Dietary Request</span>
                </div>
                <p className="text-xs text-[#564337] leading-relaxed">
                  "{sub.dietaryNotes}"
                </p>
                <div className="text-[11px] text-[#51634c] font-semibold flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Next scheduled fulfillment: Today 1:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
