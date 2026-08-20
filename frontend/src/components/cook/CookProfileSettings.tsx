import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChefHat,
  ShieldCheck,
  MapPin,
  Phone,
  Camera,
  CheckCircle,
  Save,
} from 'lucide-react';

export const CookProfileSettings: React.FC = () => {
  const { currentCookProfile, updateKitchenStatus } = useApp();

  const [name, setName] = useState(currentCookProfile.name);
  const [phone, setPhone] = useState(currentCookProfile.phone);
  const [bio, setBio] = useState(currentCookProfile.bio);
  const [location, setLocation] = useState(currentCookProfile.location);
  const [experienceYears, setExperienceYears] = useState(currentCookProfile.experienceYears);
  const [specialties, setSpecialties] = useState(currentCookProfile.specialties.join(', '));
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateKitchenStatus({
      name,
      phone,
      bio,
      location,
      experienceYears: Number(experienceYears),
      specialties: specialties.split(',').map((s) => s.trim()),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-[#944a00]" />
          <span>Home Cook Business Profile & Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#564337]">
          Manage your public kitchen profile, culinary bio, FSSAI hygiene credentials, and neighborhood pickup address.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-[#d1e6c9] text-[#51634c] text-xs font-bold rounded-xl flex items-center gap-2 shadow-2xs">
          <CheckCircle className="w-4 h-4" />
          <span>Profile and business credentials updated successfully!</span>
        </div>
      )}

      {/* Profile Card Banner */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={currentCookProfile.avatar}
            alt={currentCookProfile.name}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-[#ffdcc5] shadow-sm"
          />
          <button
            type="button"
            className="absolute -bottom-2 -right-2 p-2 bg-[#944a00] text-white rounded-full shadow-xs hover:bg-[#713700] transition-colors"
            title="Change Avatar"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="text-xl font-extrabold text-[#1a1c1c]">{name}</h3>
            <span className="p-1 rounded-full bg-[#d1e6c9] text-[#51634c]" title="FSSAI Verified">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-[#564337]">
            {location} • {experienceYears} Years Home Culinary Experience
          </p>
          <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ffdcc5] text-[#944a00]">
              ★ {currentCookProfile.rating} Rating ({currentCookProfile.reviewsCount} Reviews)
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#d1e6c9] text-[#51634c]">
              {currentCookProfile.hygieneRating}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 sm:p-8 space-y-6 shadow-2xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
          Public Business Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Kitchen / Chef Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Contact Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Neighborhood Kitchen Address</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Experience (Years)</label>
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1a1c1c]">Signature Specialties (Comma separated)</label>
          <input
            type="text"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1a1c1c]">Kitchen Bio / Story</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] leading-relaxed"
          />
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337] pt-2">
          Safety & Hygiene Compliance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 space-y-1">
            <div className="font-bold text-[#51634c] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> FSSAI Registration No.
            </div>
            <div className="font-mono text-xs font-bold text-[#1a1c1c]">21424058000192</div>
            <div className="text-[11px] text-[#564337]">Valid until Dec 2027 • Verified</div>
          </div>

          <div className="p-3.5 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 space-y-1">
            <div className="font-bold text-[#51634c] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Clean Kitchen Certification
            </div>
            <div className="text-xs font-bold text-[#1a1c1c]">FSSAI Hygiene Gold Rating (5/5)</div>
            <div className="text-[11px] text-[#564337]">Annual physical kitchen inspection passed</div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Credentials</span>
          </button>
        </div>
      </form>
    </div>
  );
};
