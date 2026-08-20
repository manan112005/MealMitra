import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  MapPin,
  Heart,
  Award,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { userSubscription } = useApp();
  const [name, setName] = useState('Jay Shah');
  const [email, setEmail] = useState('jay.shah@example.com');
  const [phone, setPhone] = useState('+91 99250 12345');
  const [dietaryPreference, setDietaryPreference] = useState('Vegetarian');
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[#944a00]" />
          <span>Customer Profile & Dining Preferences</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#564337]">
          Manage your personal details, food habits, delivery addresses, and loyalty rewards.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3 bg-[#d1e6c9] text-[#51634c] font-bold text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Profile preferences updated successfully!</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#ffdcc5] text-[#944a00] flex items-center justify-center font-extrabold text-base">
            JS
          </div>
          <div>
            <div className="font-extrabold text-sm text-[#1a1c1c]">{name}</div>
            <div className="text-xs text-[#564337]">{phone}</div>
            <span className="text-[10px] font-semibold text-[#51634c] bg-[#d1e6c9] px-2 py-0.5 rounded-full inline-block mt-1">
              Active Member
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#564337]">
            <Award className="w-4 h-4 text-[#51634c]" />
            <span>Mitra Rewards</span>
          </div>
          <div className="text-2xl font-extrabold text-[#51634c]">1,250 Pts</div>
          <div className="text-[11px] text-[#564337]">Worth ₹125 discount on future orders</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#564337]">
            <Sparkles className="w-4 h-4 text-[#944a00]" />
            <span>Subscription Status</span>
          </div>
          <div className="text-base font-extrabold text-[#944a00]">
            {userSubscription ? userSubscription.planTitle : 'No Active Plan'}
          </div>
          <div className="text-[11px] text-[#564337]">
            {userSubscription ? `${userSubscription.remainingDays} days remaining` : 'Subscribe for daily tiffins'}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 sm:p-8 space-y-6 shadow-2xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">City / Location</label>
            <input
              type="text"
              defaultValue="Ahmedabad, Gujarat"
              disabled
              className="w-full px-3 py-2 text-xs bg-gray-100 border border-[#dcc1b1] rounded-xl text-gray-600"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337] pt-2">
          Culinary & Dietary Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Dietary Type</label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
            >
              <option value="Vegetarian">Pure Vegetarian</option>
              <option value="Jain">Jain (No Root Veg / Onion / Garlic)</option>
              <option value="High Protein">High Protein Vegetarian</option>
              <option value="Vegan">100% Vegan</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Spice Preference</label>
            <select
              value={spiceLevel}
              onChange={(e) => setSpiceLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
            >
              <option value="Mild">Mild / Lightly Spiced (Kid friendly)</option>
              <option value="Medium">Medium Authentic Homestyle</option>
              <option value="Spicy">Spicy & Chatpata</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Save Profile Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
