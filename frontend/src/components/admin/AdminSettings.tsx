import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, CheckCircle2, Sliders, DollarSign, Navigation, Zap } from 'lucide-react';

interface PlatformSettingsState {
  platformCommission: number;
  deliveryPartnerRate: number;
  cookShareRate: number;
  deliveryRadiusKm: number;
  freeDeliveryThreshold: number;
  autoApproveCooks: boolean;
  enableSmartClustering: boolean;
  evPriorityRouting: boolean;
}

const DEFAULT_SETTINGS: PlatformSettingsState = {
  platformCommission: 10,
  deliveryPartnerRate: 10,
  cookShareRate: 80,
  deliveryRadiusKm: 6.5,
  freeDeliveryThreshold: 299,
  autoApproveCooks: true,
  enableSmartClustering: true,
  evPriorityRouting: true,
};

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettingsState>(() => {
    try {
      const saved = localStorage.getItem('mealmitra_platform_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('mealmitra_platform_settings', JSON.stringify(settings));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c]">Platform Settings</h2>
          <p className="text-[#564337] mt-1">Configure revenue margins, AI routing thresholds, and verification rules</p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings updated & active!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue & Commission Card */}
        <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#dcc1b1]/30">
            <DollarSign className="w-5 h-5 text-[#944a00]" />
            <h3 className="font-bold text-base text-[#1a1c1c]">Revenue & Fee Splits</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] uppercase tracking-wider mb-1">
                Platform Commission Fee (%)
              </label>
              <input 
                type="number" 
                min={0}
                max={50}
                value={settings.platformCommission}
                onChange={(e) => setSettings({ ...settings, platformCommission: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white border border-[#dcc1b1] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#944a00]"
              />
              <p className="text-[11px] text-[#564337] mt-1">Platform operational and tech fee per order.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] uppercase tracking-wider mb-1">
                Cook Revenue Share (%)
              </label>
              <input 
                type="number" 
                min={50}
                max={100}
                value={settings.cookShareRate}
                onChange={(e) => setSettings({ ...settings, cookShareRate: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white border border-[#dcc1b1] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#944a00]"
              />
              <p className="text-[11px] text-[#564337] mt-1">Disbursed directly to home chefs bi-weekly.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] uppercase tracking-wider mb-1">
                Delivery Partner Payout Rate (%)
              </label>
              <input 
                type="number" 
                min={0}
                max={30}
                value={settings.deliveryPartnerRate}
                onChange={(e) => setSettings({ ...settings, deliveryPartnerRate: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white border border-[#dcc1b1] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#944a00]"
              />
              <p className="text-[11px] text-[#564337] mt-1">Direct fuel and run payout per delivery stop.</p>
            </div>
          </div>
        </div>

        {/* AI & Dispatching Settings */}
        <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#dcc1b1]/30">
            <Navigation className="w-5 h-5 text-[#005cb8]" />
            <h3 className="font-bold text-base text-[#1a1c1c]">Clustering & Service Area</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] uppercase tracking-wider mb-1">
                Max Home Delivery Radius (KM)
              </label>
              <input 
                type="number" 
                step="0.5"
                value={settings.deliveryRadiusKm}
                onChange={(e) => setSettings({ ...settings, deliveryRadiusKm: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white border border-[#dcc1b1] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#944a00]"
              />
              <p className="text-[11px] text-[#564337] mt-1">Hot meal delivery radius from home kitchen.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] uppercase tracking-wider mb-1">
                Free Delivery Threshold (₹)
              </label>
              <input 
                type="number" 
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white border border-[#dcc1b1] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#944a00]"
              />
              <p className="text-[11px] text-[#564337] mt-1">Minimum cart value to waive delivery fee.</p>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.enableSmartClustering}
                  onChange={(e) => setSettings({ ...settings, enableSmartClustering: e.target.checked })}
                  className="w-4 h-4 rounded text-[#944a00] focus:ring-[#944a00] cursor-pointer" 
                />
                <div>
                  <span className="block text-xs font-bold text-[#1a1c1c]">Smart Route Clustering (AI)</span>
                  <span className="block text-[11px] text-[#564337]">Batch nearby customer orders to a single cook pickup stop.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.autoApproveCooks}
                  onChange={(e) => setSettings({ ...settings, autoApproveCooks: e.target.checked })}
                  className="w-4 h-4 rounded text-[#944a00] focus:ring-[#944a00] cursor-pointer" 
                />
                <div>
                  <span className="block text-xs font-bold text-[#1a1c1c]">Auto-Approve Cook Registrations</span>
                  <span className="block text-[11px] text-[#564337]">Bypass manual review for instant home cook onboarding.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button 
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-[#944a00] hover:bg-[#7a3d00] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>
    </form>
  );
};

