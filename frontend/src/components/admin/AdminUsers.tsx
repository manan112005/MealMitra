import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, ChefHat, Bike, Search, ShieldCheck } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { cooks } = useApp();
  const [activeTab, setActiveTab] = useState<'customers' | 'cooks' | 'delivery'>('cooks');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c]">User Management</h2>
          <p className="text-[#564337] mt-1">Manage accounts across the 3-sided ecosystem</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#564337]" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#dcc1b1] rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex bg-white p-1 rounded-xl border border-[#dcc1b1]/50 w-full sm:w-fit shadow-2xs">
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 sm:flex-none justify-center
            ${activeTab === 'customers' ? 'bg-orange-50 text-orange-700 shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'}`}
        >
          <Users className="w-4 h-4" /> Customers
        </button>
        <button
          onClick={() => setActiveTab('cooks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 sm:flex-none justify-center
            ${activeTab === 'cooks' ? 'bg-green-50 text-green-700 shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'}`}
        >
          <ChefHat className="w-4 h-4" /> Home Cooks
        </button>
        <button
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 sm:flex-none justify-center
            ${activeTab === 'delivery' ? 'bg-blue-50 text-blue-700 shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'}`}
        >
          <Bike className="w-4 h-4" /> Partners
        </button>
      </div>

      {/* Content based on tab */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 shadow-2xs overflow-hidden">
        {activeTab === 'cooks' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf9f8] border-b border-[#dcc1b1]/40 text-xs font-bold text-[#564337] uppercase tracking-wider">
                  <th className="p-4">Cook Profile</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Rating / Reviews</th>
                  <th className="p-4">Meals Delivered</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dcc1b1]/20">
                {cooks.map((cook) => (
                  <tr key={cook.id} className="hover:bg-[#faf9f8]/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={cook.avatar} alt={cook.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-[#1a1c1c] text-sm">{cook.name}</p>
                          <p className="text-xs text-[#564337]">{cook.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#1a1c1c]">{cook.location}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#1a1c1c]">{cook.rating.toFixed(1)}</span>
                        <span className="text-xs text-[#564337]">({cook.reviewsCount})</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-[#1a1c1c]">{cook.mealsDelivered}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase ${cook.kitchenOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {cook.kitchenOpen ? 'Kitchen Open' : 'Closed'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-indigo-600 font-semibold text-xs hover:underline">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab !== 'cooks' && (
          <div className="p-12 text-center text-[#564337]">
            <ShieldCheck className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
            <p className="font-semibold text-[#1a1c1c]">Data restricted in MVP.</p>
            <p className="text-sm mt-1">This section is available in the full production version.</p>
          </div>
        )}
      </div>
    </div>
  );
};
