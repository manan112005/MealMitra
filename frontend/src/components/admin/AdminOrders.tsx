import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClipboardList, Search, Filter } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c]">Live Orders & Tracking</h2>
          <p className="text-[#564337] mt-1">Monitor all active and past orders on the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#564337]" />
            <input 
              type="text" 
              placeholder="Search Order ID..." 
              className="pl-9 pr-4 py-2 bg-white border border-[#dcc1b1] rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-full sm:w-48"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dcc1b1] text-[#1a1c1c] font-semibold text-sm rounded-xl hover:bg-[#faf9f8] transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border
              ${filterStatus === status 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                : 'bg-white text-[#564337] border-[#dcc1b1]/60 hover:border-indigo-400'}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf9f8] border-b border-[#dcc1b1]/40 text-xs font-bold text-[#564337] uppercase tracking-wider">
                <th className="p-4">Order Details</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Home Cook</th>
                <th className="p-4">Partner</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dcc1b1]/20">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#faf9f8]/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm border border-[#dcc1b1]/30">
                        <img src={order.mealImage} alt={order.mealName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1a1c1c] text-sm">{order.id}</p>
                        <p className="text-xs text-[#564337] max-w-[120px] truncate">{order.mealName} x{order.quantity}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-[#1a1c1c]">{order.customerName}</p>
                    <p className="text-[10px] text-[#564337] truncate max-w-[100px]">{order.customerAddress}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img src={order.cookAvatar} alt={order.cookName} className="w-6 h-6 rounded-full" />
                      <p className="text-sm text-[#1a1c1c]">{order.cookName}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#1a1c1c]">
                    {order.deliveryPartnerName || <span className="text-[#944a00] text-xs font-medium bg-[#ffdcc5]/50 px-2 py-0.5 rounded">Unassigned</span>}
                  </td>
                  <td className="p-4 text-sm font-bold text-[#1a1c1c]">
                    ₹{order.totalAmount}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-indigo-100 text-indigo-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 font-semibold text-xs hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-12 text-center text-[#564337]">
              <ClipboardList className="w-12 h-12 text-[#dcc1b1] mx-auto mb-3" />
              <p className="font-semibold text-[#1a1c1c]">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
