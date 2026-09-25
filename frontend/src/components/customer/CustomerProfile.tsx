import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Award,
  CheckCircle,
  Sparkles,
  MapPin,
  Save,
  Loader2,
  Camera,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Sparkle,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageUtils';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
];

export const CustomerProfile: React.FC = () => {
  const { userSubscription } = useApp();
  const { currentUser, updateUserProfile } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [address, setAddress] = useState(
    currentUser?.applicationDetails?.address || 'A-402, Shivalik Residency, Navrangpura'
  );
  const [city, setCity] = useState(
    currentUser?.applicationDetails?.city || 'Ahmedabad, Gujarat'
  );
  const [dietaryPreference, setDietaryPreference] = useState(
    currentUser?.applicationDetails?.dietaryPreference ||
      currentUser?.applicationDetails?.dietaryPreferences ||
      'Vegetarian'
  );
  const [spiceLevel, setSpiceLevel] = useState(
    currentUser?.applicationDetails?.spiceLevel || 'Medium'
  );
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAvatar(currentUser.avatar || '');
      if (currentUser.applicationDetails?.address) {
        setAddress(currentUser.applicationDetails.address);
      }
      if (currentUser.applicationDetails?.city) {
        setCity(currentUser.applicationDetails.city);
      }
      if (
        currentUser.applicationDetails?.dietaryPreference ||
        currentUser.applicationDetails?.dietaryPreferences
      ) {
        setDietaryPreference(
          currentUser.applicationDetails.dietaryPreference ||
            currentUser.applicationDetails.dietaryPreferences
        );
      }
      if (currentUser.applicationDetails?.spiceLevel) {
        setSpiceLevel(currentUser.applicationDetails.spiceLevel);
      }
    }
  }, [currentUser]);

  const getInitials = (fullName: string) => {
    if (!fullName) return 'CU';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getInitialsSvg = (fullName: string) => {
    const initial = getInitials(fullName);
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="100%" height="100%" fill="%23ffdcc5"/><text x="50%" y="54%" font-size="44" font-weight="bold" fill="%23944a00" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif">${initial}</text></svg>`;
  };

  // Handle local file upload from device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Compress to optimal thumbnail size (<25KB)
      const compressed = await compressImageFile(file, 256, 256, 0.85);
      if (compressed) {
        setAvatar(compressed);
        await updateUserProfile({ avatar: compressed });
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 3000);
      }
    } catch (err) {
      console.error('Failed to process image file:', err);
      // Fallback
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setAvatar(base64);
          await updateUserProfile({ avatar: base64 });
          setSavedMsg(true);
          setTimeout(() => setSavedMsg(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = async (presetUrl: string) => {
    setAvatar(presetUrl);
    setShowPresetPicker(false);
    await updateUserProfile({ avatar: presetUrl });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleResetToInitials = async () => {
    const defaultSvg = getInitialsSvg(name || 'User');
    setAvatar(defaultSvg);
    await updateUserProfile({ avatar: defaultSvg });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar: avatar || getInitialsSvg(name),
        applicationDetails: {
          address: address.trim(),
          city: city.trim(),
          dietaryPreference,
          dietaryPreferences: dietaryPreference,
          spiceLevel,
        },
      });
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      console.error('Error saving profile', err);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const currentAvatarSrc = avatar || (currentUser?.avatar ? currentUser.avatar : getInitialsSvg(name || 'Customer'));

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      {/* Hidden File Input for Custom Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div>
        <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[#944a00]" />
          <span>Customer Profile & Photo Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#564337]">
          Update your profile picture, personal details, dining preferences, and delivery addresses.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3.5 bg-[#d1e6c9] border border-[#51634c]/20 text-[#51634c] font-bold text-xs rounded-xl flex items-center gap-2 shadow-2xs animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-[#51634c] shrink-0" />
          <span>Profile photo and preferences updated successfully!</span>
        </div>
      )}

      {/* Profile Header & Photo Card */}
      <div className="bg-white rounded-3xl border border-[#dcc1b1]/60 p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar with Camera Overlay */}
          <div className="relative group">
            <img
              src={currentAvatarSrc}
              alt={name || 'User Avatar'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-[#ffdcc5] shadow-md transition-transform group-hover:scale-[1.02]"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2.5 bg-[#944a00] hover:bg-[#713700] text-white rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center hover:scale-110"
              title="Upload new profile photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-extrabold text-[#1a1c1c]">{name || 'Customer'}</h3>
              <span className="text-[10px] font-bold text-[#51634c] bg-[#d1e6c9] px-2.5 py-0.5 rounded-full inline-block">
                Active Member
              </span>
            </div>
            <p className="text-xs text-[#564337]">{phone || email}</p>
            <p className="text-[11px] text-[#944a00] font-semibold">{city || 'Ahmedabad, Gujarat'}</p>
          </div>
        </div>

        {/* Action Buttons for Avatar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPresetPicker(!showPresetPicker)}
            className="px-3.5 py-2 bg-[#faf9f8] hover:bg-[#eeeeed] text-[#1a1c1c] border border-[#dcc1b1] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#944a00]" />
            <span>Choose Preset</span>
          </button>

          <button
            type="button"
            onClick={handleResetToInitials}
            title="Reset to clean initials avatar"
            className="p-2 text-[#564337] hover:text-red-600 hover:bg-red-50 border border-[#dcc1b1]/50 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Avatar Picker Dropdown / Box */}
      {showPresetPicker && (
        <div className="p-5 bg-white rounded-2xl border border-[#dcc1b1] shadow-md animate-in fade-in space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1a1c1c]">Select a Curated Profile Avatar:</span>
            <button
              onClick={() => setShowPresetPicker(false)}
              className="text-xs text-[#564337] hover:text-[#1a1c1c]"
            >
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-1">
            {PRESET_AVATARS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`group relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer aspect-square ${
                  avatar === preset
                    ? 'border-[#944a00] ring-2 ring-[#944a00]/30 scale-105'
                    : 'border-transparent hover:border-[#ffdcc5]'
                }`}
              >
                <img
                  src={preset}
                  alt={`Preset ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reward & Subscription Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#564337]">
            <Award className="w-4 h-4 text-[#51634c]" />
            <span>Mitra Rewards</span>
          </div>
          <div className="text-2xl font-extrabold text-[#51634c]">
            {currentUser?.applicationDetails?.loyaltyPoints || 0} Pts
          </div>
          <div className="text-[11px] text-[#564337]">Earn reward points with every tiffin delivery</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#564337]">
            <Sparkles className="w-4 h-4 text-[#944a00]" />
            <span>Subscription Status</span>
          </div>
          <div className="text-base font-extrabold text-[#944a00]">
            {userSubscription ? userSubscription.planName || userSubscription.planCategory : 'No Active Plan'}
          </div>
          <div className="text-[11px] text-[#564337]">
            {userSubscription ? `${userSubscription.remainingDays} days remaining` : 'Subscribe for hassle-free daily meals'}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#dcc1b1]/60 p-6 sm:p-8 space-y-6 shadow-2xs">
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
              required
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">City / Location</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#944a00]" />
              <span>Default Delivery Address (Flat / House / Society / Area)</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. A-402, Shivalik Residency, Near Vastrapur Lake"
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
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
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00] cursor-pointer"
            >
              <option value="Vegetarian">Pure Vegetarian</option>
              <option value="Jain">Jain (No Root Veg / Onion / Garlic)</option>
              <option value="High Protein">High Protein Vegetarian</option>
              <option value="Vegan">100% Vegan</option>
              <option value="Both">Both Veg & Non-Veg</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Spice Preference</label>
            <select
              value={spiceLevel}
              onChange={(e) => setSpiceLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00] cursor-pointer"
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
            disabled={isSaving}
            className="px-7 py-3 bg-[#944a00] hover:bg-[#713700] disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
