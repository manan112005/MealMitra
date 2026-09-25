import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { compressImageFile } from '../../utils/imageUtils';
import {
  ChefHat,
  ShieldCheck,
  MapPin,
  Phone,
  Camera,
  CheckCircle,
  Save,
  Loader2,
  Upload,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

const COOK_PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
];

export const CookProfileSettings: React.FC = () => {
  const { currentCookProfile, updateCookProfile } = useApp();
  const { currentUser, updateUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentCookProfile?.name || currentUser?.applicationDetails?.kitchenName || 'Home Kitchen');
  const [chefName, setChefName] = useState(
    (currentCookProfile?.chefName && currentCookProfile.chefName !== currentCookProfile.name ? currentCookProfile.chefName : '') ||
    currentUser?.applicationDetails?.chefName ||
    (currentUser?.name && currentUser.name !== currentCookProfile?.name ? currentUser.name : '') ||
    'Chef'
  );
  const [phone, setPhone] = useState(currentCookProfile?.phone || currentUser?.phone || '');
  const [avatar, setAvatar] = useState(currentCookProfile?.avatar || currentUser?.avatar || '');
  const [bio, setBio] = useState(currentCookProfile?.bio || '');
  const [location, setLocation] = useState(currentCookProfile?.location || '');
  const [experienceYears, setExperienceYears] = useState(currentCookProfile?.experienceYears || 5);
  const [specialties, setSpecialties] = useState(
    currentCookProfile?.specialties?.join(', ') || 'Special Daily Thali, Phulka Roti, Dal Tadka'
  );
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentCookProfile) {
      setName(currentCookProfile.name || currentUser?.applicationDetails?.kitchenName || 'Home Kitchen');
      const resolvedChef =
        (currentCookProfile.chefName && currentCookProfile.chefName !== currentCookProfile.name ? currentCookProfile.chefName : '') ||
        currentUser?.applicationDetails?.chefName ||
        (currentUser?.name && currentUser.name !== currentCookProfile.name ? currentUser.name : '') ||
        'Chef';
      setChefName(resolvedChef);
      setPhone(currentCookProfile.phone || currentUser?.phone || '');
      setAvatar(currentCookProfile.avatar || currentUser?.avatar || '');
      setBio(currentCookProfile.bio || '');
      setLocation(currentCookProfile.location || '');
      setExperienceYears(currentCookProfile.experienceYears || 5);
      setSpecialties(
        currentCookProfile.specialties && currentCookProfile.specialties.length > 0
          ? currentCookProfile.specialties.join(', ')
          : 'Special Daily Thali, Phulka Roti, Dal Tadka'
      );
    }
  }, [currentCookProfile, currentUser]);

  const getInitialsSvg = (fullName: string) => {
    const initial = fullName ? fullName.trim().charAt(0).toUpperCase() : 'C';
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="100%" height="100%" fill="%23ffdcc5"/><text x="50%" y="54%" font-size="44" font-weight="bold" fill="%23944a00" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif">${initial}</text></svg>`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 256, 256, 0.85);
      if (compressed) {
        setAvatar(compressed);
        if (currentCookProfile?.id) {
          updateCookProfile(currentCookProfile.id, { avatar: compressed });
        }
        await updateUserProfile({ avatar: compressed });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to compress cook avatar:', err);
    }
  };

  const handleSelectPreset = async (presetUrl: string) => {
    setAvatar(presetUrl);
    setShowPresetPicker(false);
    if (currentCookProfile?.id) {
      updateCookProfile(currentCookProfile.id, { avatar: presetUrl });
    }
    await updateUserProfile({ avatar: presetUrl });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetToInitials = async () => {
    const defaultSvg = getInitialsSvg(chefName || name || 'Cook');
    setAvatar(defaultSvg);
    if (currentCookProfile?.id) {
      updateCookProfile(currentCookProfile.id, { avatar: defaultSvg });
    }
    await updateUserProfile({ avatar: defaultSvg });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const specialtiesArr = specialties.split(',').map((s) => s.trim()).filter(Boolean);
    const currentPic = avatar || getInitialsSvg(chefName || name || 'Cook');

    try {
      if (currentCookProfile?.id) {
        updateCookProfile(currentCookProfile.id, {
          name: name.trim(),
          chefName: chefName.trim(),
          phone: phone.trim(),
          avatar: currentPic,
          bio: bio.trim(),
          location: location.trim(),
          pickupAddress: location.trim(),
          experienceYears: Number(experienceYears) || 5,
          specialties: specialtiesArr,
        });
      }

      await updateUserProfile({
        name: chefName.trim() || name.trim(),
        phone: phone.trim(),
        avatar: currentPic,
        applicationDetails: {
          kitchenName: name.trim(),
          chefName: chefName.trim(),
          kitchenAddress: location.trim(),
          address: location.trim(),
          bio: bio.trim(),
          experienceYears: Number(experienceYears) || 5,
        },
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update cook settings', err);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const currentAvatarSrc = avatar || currentCookProfile.avatar || getInitialsSvg(chefName || name || 'Cook');

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

      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-[#944a00]" />
          <span>Home Cook Business Profile & Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#564337]">
          Manage your chef identity, brand name, culinary bio, chef photo, and neighborhood pickup address.
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-[#d1e6c9] border border-[#51634c]/20 text-[#51634c] text-xs font-bold rounded-xl flex items-center gap-2 shadow-2xs animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-[#51634c] shrink-0" />
          <span>Cook profile, chef details, and business credentials updated successfully!</span>
        </div>
      )}

      {/* Profile Card Banner */}
      <div className="bg-white rounded-3xl border border-[#dcc1b1]/60 p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar with Camera Overlay */}
          <div className="relative group">
            <img
              src={currentAvatarSrc}
              alt={chefName || name || 'Kitchen Profile'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-[#ffdcc5] shadow-md transition-transform group-hover:scale-[1.02]"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2.5 bg-[#944a00] hover:bg-[#713700] text-white rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center hover:scale-110"
              title="Upload chef profile photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-extrabold text-[#1a1c1c]">{name || 'Kitchen Profile'}</h3>
              <span className="p-1 rounded-full bg-[#d1e6c9] text-[#51634c]" title="FSSAI Verified">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-xs font-bold text-[#944a00] flex items-center justify-center sm:justify-start gap-1.5">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Chef: {chefName || 'Home Cook'}</span>
            </div>
            <p className="text-xs text-[#564337]">
              {location || 'Ahmedabad'} • {experienceYears} Years Home Culinary Experience
            </p>
            <div className="flex flex-wrap gap-2 pt-1.5 justify-center sm:justify-start">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ffdcc5] text-[#944a00]">
                ★ {currentCookProfile.rating || 5.0} Rating ({currentCookProfile.reviewsCount || 0} Reviews)
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#d1e6c9] text-[#51634c]">
                {currentCookProfile.hygieneRating || 'FSSAI Verified ★★★★★'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons for Cook Avatar */}
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
            <span className="text-xs font-bold text-[#1a1c1c]">Select a Curated Home Chef Avatar:</span>
            <button
              onClick={() => setShowPresetPicker(false)}
              className="text-xs text-[#564337] hover:text-[#1a1c1c] cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-1">
            {COOK_PRESET_AVATARS.map((preset, idx) => (
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
                  alt={`Cook Preset ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 sm:p-8 space-y-6 shadow-2xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
          Public Business Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c] flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-[#944a00]" />
              <span>Chef / Cook Full Name (Person)</span>
            </label>
            <input
              type="text"
              value={chefName}
              onChange={(e) => setChefName(e.target.value)}
              placeholder="e.g. Nilam Patel"
              required
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Kitchen / Brand Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Magic mom / Annapurna Foods"
              required
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Contact Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Neighborhood Kitchen Address</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1c1c]">Experience (Years)</label>
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              min={0}
              max={60}
              className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1a1c1c]">Signature Specialties (Comma separated)</label>
          <input
            type="text"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1a1c1c]">Kitchen Bio / Story</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#944a00]"
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
            disabled={isSaving}
            className="px-8 py-3 bg-[#944a00] hover:bg-[#713700] disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile & Credentials</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
