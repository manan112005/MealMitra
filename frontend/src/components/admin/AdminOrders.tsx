import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClipboardList, Search, Filter, Calendar, ShoppingBag, CheckCircle, Clock, Truck, ChefHat, User } from 'lucide-react';
import { Order } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, subscriptions, updateOrderStatus, updateSubscriptionStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [viewType, setViewType] = useState<'all' | 'orders' | 'subscriptions'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Unify direct orders and active subscriptions into manageable streams
  const unifiedDirectOrders = orders.map(o => ({
    ...o,
    type: 'Direct Order',
    typeBadgeColor: 'bg-orange-100 text-[#944a00]',
    displayDate: o.createdAt || 'Today',
  }));

  const unifiedSubscriptions = subscriptions.map(s => ({
    id: s.id,
    customerName: s.customerName,
    customerPhone: s.customerPhone,
    customerAddress: s.deliveryAddress,
    cookName: s.cookName,
    cookAvatar: s.cookAvatar,
    mealName: `${s.planName} (${s.frequency})`,
    mealImage: s.mealImage || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80',
    quantity: s.mealsLeft || 1,
    totalAmount: s.totalAmount || 1800,
    status: s.status === 'Active' ? 'Out for Delivery' : s.status === 'Paused' ? 'Cancelled' : 'Delivered',
    rawStatus: s.status,
    deliveryPartnerName: s.deliveryPartnerName || 'MANAN PATEL (Fleet Lead)',
    type: 'Tiffin Sub',
    typeBadgeColor: 'bg-green-100 text-green-800',
    displayDate: `Active (${s.startDate} to ${s.endDate})`,
    isSubscription: true
  }));

  const combinedList = [...unifiedDirectOrders, ...unifiedSubscriptions];

  const filteredItems = combinedList.filter(item => {
    // Type filter
    if (viewType === 'orders' && item.type !== 'Direct Order') return false;
    if (viewType === 'subscriptions' && item.type !== 'Tiffin Sub') return false;

    // Status filter
    if (filterStatus !== 'All' && item.status !== filterStatus) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchCustomer = item.customerName.toLowerCase().includes(q);
      const matchCook = item.cookName.toLowerCase().includes(q);
      const matchMeal = item.mealName.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchCook && !matchMeal) return false;
    }

    return true;
  });

  const handleStatusChange = (item: any, newStatus: string) => {
    if (item.isSubscription) {
      const subStatus = newStatus === 'Cancelled' ? 'Paused' : newStatus === 'Delivered' ? 'Expired' : 'Active';
      updateSubscriptionStatus(item.id, subStatus as any);
    } else {
      updateOrderStatus(item.id, newStatus as Order['status']);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c]">Live Orders & Tracking</h2>
          <p className="text-[#564337] mt-1">Real-time monitoring across direct orders and recurring tiffin deliveries</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#564337]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, customer, cook..." 
              className="pl-9 pr-4 py-2 bg-white border border-[#dcc1b1] rounded-xl text-sm focus:outline-none focus:border-[#944a00] w-full"
            />
          </div>
        </div>
      </div>

      {/* View Type Toggle and Status filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-white p-1 rounded-xl border border-[#dcc1b1]/50 w-full sm:w-fit shadow-xs">
          <button
            onClick={() => setViewType('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewType === 'all' ? 'bg-[#944a00] text-white shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'
            }`}
          >
            All Stream ({combinedList.length})
          </button>
          <button
            onClick={() => setViewType('orders')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewType === 'orders' ? 'bg-[#944a00] text-white shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'
            }`}
          >
            Direct Orders ({unifiedDirectOrders.length})
          </button>
          <button
            onClick={() => setViewType('subscriptions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewType === 'subscriptions' ? 'bg-[#944a00] text-white shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'
            }`}
          >
            Tiffin Subscriptions ({unifiedSubscriptions.length})
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {['All', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                filterStatus === status 
                  ? 'bg-[#1a1c1c] text-white border-[#1a1c1c]' 
                  : 'bg-white text-[#564337] border-[#dcc1b1]/60 hover:border-[#944a00]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf9f8] border-b border-[#dcc1b1]/40 text-xs font-bold text-[#564337] uppercase tracking-wider">
                <th className="p-4">Delivery Order / Item</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Home Cook</th>
                <th className="p-4">Delivery Partner</th>
                <th className="p-4">Gross Amount</th>
                <th className="p-4">Live Status</th>
                <th className="p-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dcc1b1]/20">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#faf9f8]/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-xs border border-[#dcc1b1]/40 bg-stone-100 flex items-center justify-center">
                        <img 
                          src={item.mealImage} 
                          alt="" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1a1c1c] text-sm">{item.id}</span>
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${item.typeBadgeColor}`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs text-[#564337] max-w-[160px] truncate mt-0.5">{item.mealName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-[#1a1c1c]">{item.customerName}</p>
                    <p className="text-[11px] text-[#564337] truncate max-w-[140px]">{item.customerAddress}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={item.cookAvatar} 
                        alt="" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
                        }}
                        className="w-7 h-7 rounded-full object-cover border border-[#dcc1b1]/40" 
                      />
                      <p className="text-sm font-semibold text-[#1a1c1c]">{item.cookName}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#005cb8] font-bold">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{item.deliveryPartnerName || 'MANAN PATEL (Lead)'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-extrabold text-[#1a1c1c]">
                    ₹{item.totalAmount}
                  </td>
                  <td className="p-4">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${
                        item.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        item.status === 'Out for Delivery' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        item.status === 'Preparing' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        item.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-orange-50 text-orange-800 border-orange-200'
                      }`}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedItem(item)}
                      className="px-3 py-1 bg-[#f4efe6] hover:bg-[#ebd9c8] text-[#944a00] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-[#564337]">
              <ClipboardList className="w-12 h-12 text-[#dcc1b1] mx-auto mb-3" />
              <p className="font-bold text-lg text-[#1a1c1c]">No orders found</p>
              <p className="text-xs text-[#564337] mt-1">Try selecting another filter or adjusting your search term.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Drawer for inspecting order */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#dcc1b1]/50 space-y-4">
            <div className="flex items-center justify-between border-b border-[#dcc1b1]/30 pb-3">
              <div>
                <span className="text-xs font-bold text-[#944a00] uppercase tracking-wider">{selectedItem.type}</span>
                <h3 className="text-xl font-extrabold text-[#1a1c1c]">Order #{selectedItem.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-[#f4efe6] text-[#1a1c1c] font-bold flex items-center justify-center hover:bg-[#ebd9c8]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-[#faf9f8] rounded-xl">
                <img src={selectedItem.mealImage} alt="" className="w-14 h-14 rounded-lg object-cover" />
                <div>
                  <p className="font-bold text-[#1a1c1c]">{selectedItem.mealName}</p>
                  <p className="text-xs text-[#564337]">{selectedItem.displayDate}</p>
                  <p className="text-sm font-bold text-[#944a00] mt-1">₹{selectedItem.totalAmount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-[#dcc1b1]/40 rounded-xl">
                  <p className="text-xs font-bold text-[#564337] uppercase">Customer</p>
                  <p className="font-bold text-[#1a1c1c] text-sm mt-0.5">{selectedItem.customerName}</p>
                  <p className="text-xs text-[#564337] mt-1">{selectedItem.customerAddress}</p>
                </div>
                <div className="p-3 border border-[#dcc1b1]/40 rounded-xl">
                  <p className="text-xs font-bold text-[#564337] uppercase">Home Cook</p>
                  <p className="font-bold text-[#1a1c1c] text-sm mt-0.5">{selectedItem.cookName}</p>
                  <p className="text-xs text-[#564337] mt-1">Meal Mitra Partner</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs font-bold text-blue-900 uppercase">Assigned Delivery Partner</p>
                <p className="font-bold text-blue-950 text-sm mt-0.5">{selectedItem.deliveryPartnerName || 'MANAN PATEL (Fleet Lead)'}</p>
                <p className="text-xs text-blue-800 mt-0.5">Automated Route Optimised</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[#dcc1b1]/30">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 bg-[#944a00] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

