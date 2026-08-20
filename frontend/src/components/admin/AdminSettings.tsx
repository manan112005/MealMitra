import React from 'react';
import { Settings, Save, ShieldCheck } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1c1c]">Platform Settings</h2>
        <p className="text-[#564337] mt-1">Configure global application rules and fees</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-[#dcc1b1]/40">
          <h3 className="text-lg font-bold text-[#1a1c1c] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Global Configurations
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#1a1c1c] mb-1">Platform Commission Rate (%)</label>
              <p className="text-xs text-[#564337] mb-2">Percentage of order total taken as platform fee.</p>
              <input type="number" defaultValue={15} className="w-full max-w-xs px-4 py-2 border border-[#dcc1b1] rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1a1c1c] mb-1">Delivery Partner Payout Rate (%)</label>
              <p className="text-xs text-[#564337] mb-2">Percentage of order total paid to delivery partner.</p>
              <input type="number" defaultValue={15} className="w-full max-w-xs px-4 py-2 border border-[#dcc1b1] rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div className="pt-4 border-t border-[#dcc1b1]/30">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                <div>
                  <span className="block text-sm font-bold text-[#1a1c1c]">Auto-approve new Home Cooks</span>
                  <span className="block text-xs text-[#564337]">Bypass manual verification for new signups.</span>
                </div>
              </label>
            </div>
            
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                <div>
                  <span className="block text-sm font-bold text-[#1a1c1c]">Enable Smart Route Clustering</span>
                  <span className="block text-xs text-[#564337]">AI algorithm to group nearby orders for delivery.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="p-4 bg-[#faf9f8] flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
